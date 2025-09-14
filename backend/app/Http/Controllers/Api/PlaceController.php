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
        $places = $query->get();

        if (Auth::check()) {
            /** @var \App\Models\User $user */
            $user = Auth::user();

            $likedPlaceIds = $user->likedPlaces()->pluck('places.id')->toArray();
            $places->each(function ($place) use ($likedPlaceIds) {
                $place->is_liked = in_array($place->id, $likedPlaceIds);
            });
        }

        return response()->json($places);
    }

    /**
     * Toggle a like and update the likes count.
     */
    public function updateLikes(Request $request, Place $place)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $result = $user->likedPlaces()->toggle($place->id);

        // If a like was added, increment the count.
        if (!empty($result['attached'])) {
            // --- FIX HERE ---
            $place->increment('likes'); // Use 'likes' to match your database column
        } else {
            // Otherwise, a like was removed, so decrement.
            // --- FIX HERE ---
            $place->decrement('likes'); // Use 'likes' to match your database column
        }

        return response()->json(['status' => 'success', 'message' => 'Like status updated.']);
    }

    // --- Other methods remain the same ---

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) { return response()->json($validator->errors(), 422); }
        $data = $request->except('picture');
        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('places', 'public');
            $data['picture'] = $path;
        }
        $place = Place::create($data);
        return response()->json($place, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Place $place)
    {
        return $place;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Place $place)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'latitude' => 'sometimes|nullable|numeric|between:-90,90',
            'longitude' => 'sometimes|nullable|numeric|between:-180,180',
            'picture' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) { return response()->json($validator->errors(), 422); }
        $data = $request->except('picture');
        if ($request->hasFile('picture')) {
            if ($place->picture) { Storage::disk('public')->delete($place->picture); }
            $path = $request->file('picture')->store('places', 'public');
            $data['picture'] = $path;
        }
        $place->update($data);
        return response()->json($place);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Place $place)
    {
        if ($place->picture) { Storage::disk('public')->delete($place->picture); }
        $place->delete();
        return response()->json(null, 204);
    }
}