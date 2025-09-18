<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
     * Toggle a like and return the new state.
     */
    public function updateLikes(Request $request, Place $place)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->likedPlaces()->toggle($place->id);
        $newLikesCount = $place->likers()->count();
        $place->update(['likes' => $newLikesCount]);
        $isLiked = $user->likedPlaces()->where('place_id', $place->id)->exists();

        return response()->json([
            'new_likes_count' => $newLikesCount,
            'is_liked' => $isLiked,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * THIS IS THE CORRECTED METHOD.
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
     * THIS METHOD IS ALSO IMPROVED.
     */    public function update(Request $request, Place $place)
    {
        try {
            // Validate text-based fields
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
            ]);

            // Validate the image separately
            $request->validate([
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $dataToUpdate = $validatedData;

            // Handle the file upload if a new picture is provided
            if ($request->hasFile('picture')) {
                // Delete the old picture if it exists
                if ($place->picture) {
                    Storage::disk('public')->delete($place->picture);
                }
                
                // Store the new picture in the 'places' folder
                $path = $request->file('picture')->store('places', 'public');
                
                // Add the new picture path to our data array
                $dataToUpdate['picture'] = $path;
            }

            // Perform the update
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
     * THIS METHOD IS ALSO IMPROVED.
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