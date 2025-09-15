<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PersonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // v-- REPLACE THE OLD INDEX METHOD WITH THIS --v
        $query = Person::query();

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        // Always get the true likes count from the relationship.
        $query->withCount('likers as likes');

        // If a user is logged in, efficiently check if they have liked each person.
        if (Auth::check()) {
            $query->withExists(['likers as is_liked' => function ($query) {
                $query->where('user_id', Auth::id());
            }]);
        }
        
        $people = $query->latest()->get();

        return response()->json($people);
    }

    /**
     * Toggle a like and return the new state.
     */
    public function updateLikes(Request $request, Person $person)
    {
        // v-- REPLACE THE OLD UPDATELIKES METHOD WITH THIS --v
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Toggle the relationship in the pivot table (the source of truth)
        $user->likedPeople()->toggle($person->id);

        // Recalculate the count from the source of truth
        $newLikesCount = $person->likers()->count();
        
        // Save the new count to our cached 'likes' column
        $person->update(['likes' => $newLikesCount]);

        // Determine the new liked status
        $isLiked = $user->likedPeople()->where('person_id', $person->id)->exists();

        // Return the fresh data to the frontend
        return response()->json([
            'new_likes_count' => $newLikesCount,
            'is_liked' => $isLiked,
        ]);
    }

    // --- Other methods remain the same ---

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'bio' => 'required|string',
            'category' => 'required|string|max:255',
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'portrait_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) { return response()->json($validator->errors(), 422); }
        $data = $request->except('portrait_url');
        if ($request->hasFile('portrait_url')) {
            $path = $request->file('portrait_url')->store('portraits', 'public');
            $data['portrait_url'] = $path;
        }
        $person = Person::create($data);
        return response()->json($person, 201);
    }

    public function show(Person $person)
    {
        $person->loadCount('likers as likes');
        return response()->json($person);
    }

    public function update(Request $request, Person $person)
    {
        // This logic can be improved later, but is fine for now
        $data = $request->all();
        $person->update($data);
        return response()->json($person);
    }

    public function destroy(Person $person)
    {
        if ($person->portrait_url) { Storage::disk('public')->delete($person->portrait_url); }
        $person->delete();
        return response()->json(['message' => 'Person deleted successfully.']);
    }
}