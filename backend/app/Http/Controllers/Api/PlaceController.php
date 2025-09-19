<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // <-- ADDED FOR TRANSACTIONS

class PlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Place::query();

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        $query->withCount('likers as likes');

        if (Auth::check()) {
            $query->withExists(['likers as is_liked' => function ($query) {
                $query->where('user_id', Auth::id());
            }]);
        }
        
        $places = $query->latest()->get();

        return response()->json($places);
    }

    /**
     * THIS FUNCTION HAS BEEN UPDATED FOR RELIABILITY
     * Toggles the like status and ensures data consistency with a transaction.
     */
    public function updateLikes(Request $request, Place $place)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        return DB::transaction(function () use ($user, $place) {
            // 1. Toggle the relationship in the pivot table.
            $user->likedPlaces()->toggle($place->id);
            
            // 2. Recalculate the count.
            $newLikesCount = $place->likers()->count();
            
            // 3. Update the cached 'likes' column.
            $place->update(['likes' => $newLikesCount]);
            
            // 4. Check the new "liked" status.
            $isLiked = $user->likedPlaces()->where('place_id', $place->id)->exists();
            
            // 5. Return the fresh data.
            return response()->json([
                'new_likes_count' => $newLikesCount,
                'is_liked' => $isLiked,
            ]);
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('picture');

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('places', 'public');
            $data['picture'] = $path;
        }

        $place = Place::create($data);
        return response()->json($place, 201);
    }

    public function show(Place $place)
    {
        $place->loadCount('likers as likes');
        return response()->json($place);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Place $place)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
            ]);
            $request->validate([
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            $dataToUpdate = $validatedData;
            if ($request->hasFile('picture')) {
                if ($place->picture) {
                    Storage::disk('public')->delete($place->picture);
                }
                $path = $request->file('picture')->store('places', 'public');
                $dataToUpdate['picture'] = $path;
            }
            $place->update($dataToUpdate);
            return response()->json($place);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update place', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Place $place)
    {
        if ($place->picture) {
            Storage::disk('public')->delete($place->picture);
        }
        $place->delete();
        return response()->json(['message' => 'Place deleted successfully.']);
    }
}