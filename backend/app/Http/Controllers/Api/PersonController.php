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
        // MODIFICATION: Removed withCount('likers') as we now have a dedicated likes_count column.
        $query = Person::query();

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }
        $people = $query->get();

        if (Auth::check()) {
            /** @var \App\Models\User $user */
            $user = Auth::user();

            $likedPersonIds = $user->likedPeople()->pluck('people.id')->toArray();
            $people->each(function ($person) use ($likedPersonIds) {
                $person->is_liked = in_array($person->id, $likedPersonIds);
            });
        }

        return response()->json($people);
    }

    /**
     * Toggle a like and update the likes_count.
     */
    public function updateLikes(Request $request, Person $person)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // --- NEW LOGIC TO UPDATE COUNT ---
        $result = $user->likedPeople()->toggle($person->id);

        // If a like was added, increment the count.
        if (!empty($result['attached'])) {
            $person->increment('likes_count');
        } else {
            // Otherwise, a like was removed, so decrement.
            $person->decrement('likes_count');
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
            'bio' => 'required|string',
            'category' => 'required|string|max:255',
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) { return response()->json($validator->errors(), 422); }
        $data = $request->except('picture');
        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('portraits', 'public');
            $data['portrait_url'] = $path;
        }
        $person = Person::create($data);
        return response()->json($person, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Person $person)
    {
        return $person;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Person $person)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'bio' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) { return response()->json($validator->errors(), 422); }
        $data = $request->except('picture');
        if ($request->hasFile('picture')) {
            if ($person->portrait_url) { Storage::disk('public')->delete($person->portrait_url); }
            $path = $request->file('picture')->store('portraits', 'public');
            $data['portrait_url'] = $path;
        }
        $person->update($data);
        return response()->json($person);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Person $person)
    {
        if ($person->portrait_url) { Storage::disk('public')->delete($person->portrait_url); }
        $person->delete();
        return response()->json(['message' => 'Person deleted successfully.']);
    }
}