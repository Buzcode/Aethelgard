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
        // v-- REPLACE THE OLD INDEX METHOD WITH THIS --v
        $query = Place::query();

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        // Always get the true likes count from the relationship.
        $query->withCount('likers as likes');

        // If a user is logged in, efficiently check if they have liked each place.
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
        // v-- REPLACE THE OLD UPDATELIKES METHOD WITH THIS --v
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Toggle the relationship in the pivot table (the source of truth)
        $user->likedPlaces()->toggle($place->id);

        // Recalculate the count from the source of truth
        $newLikesCount = $place->likers()->count();
        
        // Save the new count to our cached 'likes' column
        $place->update(['likes' => $newLikesCount]);

        // Determine the new liked status
        $isLiked = $user->likedPlaces()->where('place_id', $place->id)->exists();

        // Return the fresh data to the frontend
        return response()->json([
            'new_likes_count' => $newLikesCount,
            'is_liked' => $isLiked,
        ]);
    }

    // --- Other methods remain the same ---

    public function store(Request $request)
    {
        // Logic remains the same
        $data = $request->all();
        $place = Place::create($data);
        return response()->json($place, 201);
    }

    public function show(Place $place)
    {
        $place->loadCount('likers as likes');
        return response()->json($place);
    }

    public function update(Request $request, Place $place)
    {
        // Logic remains the same
        $data = $request->all();
        $place->update($data);
        return response()->json($place);
    }

    public function destroy(Place $place)
    {
        // Logic remains the same
        if ($place->picture) { Storage::disk('public')->delete($place->picture); }
        $place->delete();
        return response()->json(null, 204);
    }
}