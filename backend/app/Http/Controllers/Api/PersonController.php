<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request; 
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
        $people = $query->get();
        return response()->json($people);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // --- MODIFICATION START ---
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'bio' => 'required|string',
            'category' => 'required|string|max:255', // Added category validation
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Changed to 'picture' to match form
        ]);
        // --- MODIFICATION END ---

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('picture'); 

        // --- MODIFICATION START ---
        // Changed to check for 'picture' file from the form
        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('portraits', 'public');
            $data['portrait_url'] = $path; // Still saves to the correct 'portrait_url' column
        }
        // --- MODIFICATION END ---

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
            'category' => 'nullable|string|max:255', // Also added here for updates
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Changed to 'picture'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $data = $request->except('picture');

        if ($request->hasFile('picture')) {
            if ($person->portrait_url) {
                Storage::disk('public')->delete($person->portrait_url);
            }
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
        if ($person->portrait_url) {
            Storage::disk('public')->delete($person->portrait_url);
        }
        $person->delete();
        return response()->json(['message' => 'Person deleted successfully.']);
    }
}