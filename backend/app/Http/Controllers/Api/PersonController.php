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
        $query = Person::query();

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        $query->withCount('likers as likes');

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
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->likedPeople()->toggle($person->id);
        $newLikesCount = $person->likers()->count();
        $person->update(['likes' => $newLikesCount]);
        $isLiked = $user->likedPeople()->where('person_id', $person->id)->exists();

        return response()->json([
            'new_likes_count' => $newLikesCount,
            'is_liked' => $isLiked,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // --- THIS METHOD HAS BEEN CORRECTED ---
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'bio' => 'required|string',
            'category' => 'required|string|max:255',
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Changed from 'portrait_url'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('picture'); // Changed from 'portrait_url'

        if ($request->hasFile('picture')) { // Changed from 'portrait_url'
            $path = $request->file('picture')->store('portraits', 'public'); // Changed from 'portrait_url'
            $data['picture'] = $path; // Changed from 'portrait_url'
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
        try {
            // Validate text-based fields
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'bio' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                'birth_date' => 'nullable|string|max:255',
                'death_date' => 'nullable|string|max:255',
            ]);

            // Validate the image separately
            $request->validate([
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $dataToUpdate = $validatedData;

            // Handle the file upload if a new picture is provided
            if ($request->hasFile('picture')) {
                // Delete the old picture if it exists
                if ($person->picture) {
                    Storage::disk('public')->delete($person->picture);
                }
                
                // Store the new picture in the 'portraits' folder
                $path = $request->file('picture')->store('portraits', 'public');
                
                // Add the new picture path to our data array
                $dataToUpdate['picture'] = $path;
            }

            // Perform the update
            $person->update($dataToUpdate);

            return response()->json($person);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update person', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Person $person)
    {
        // --- THIS METHOD HAS BEEN CORRECTED ---
        if ($person->picture) { // Changed from 'portrait_url'
            Storage::disk('public')->delete($person->picture); // Changed from 'portrait_url'
        }
        $person->delete();
        return response()->json(['message' => 'Person deleted successfully.']);
    }
}