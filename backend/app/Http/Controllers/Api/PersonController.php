<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB; // <-- ADDED FOR TRANSACTIONS

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
     * THIS FUNCTION HAS BEEN UPDATED FOR RELIABILITY
     * Toggles the like status and ensures data consistency with a transaction.
     */
    public function updateLikes(Request $request, Person $person)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        return DB::transaction(function () use ($user, $person) {
            // 1. Toggle the relationship in the pivot table.
            $user->likedPeople()->toggle($person->id);

            // 2. Recalculate the count.
            $newLikesCount = $person->likers()->count();
            
            // 3. Update the cached 'likes' column.
            $person->update(['likes' => $newLikesCount]);

            // 4. Check the new "liked" status.
            $isLiked = $user->likedPeople()->where('person_id', $person->id)->exists();

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
            'bio' => 'required|string',
            'category' => 'required|string|max:255',
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('picture');

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('portraits', 'public');
            $data['picture'] = $path;
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
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'bio' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                'birth_date' => 'nullable|string|max:255',
                'death_date' => 'nullable|string|max:255',
            ]);
            $request->validate([
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            $dataToUpdate = $validatedData;
            if ($request->hasFile('picture')) {
                if ($person->picture) {
                    Storage::disk('public')->delete($person->picture);
                }
                $path = $request->file('picture')->store('portraits', 'public');
                $dataToUpdate['picture'] = $path;
            }
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
        if ($person->picture) {
            Storage::disk('public')->delete($person->picture);
        }
        $person->delete();
        return response()->json(['message' => 'Person deleted successfully.']);
    }
}