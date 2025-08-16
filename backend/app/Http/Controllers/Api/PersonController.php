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
    public function index()
    {
        // Simply fetch all people from the database
        return Person::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 2. Update validation to expect an image file, not a URL
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'portrait_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Expects a file named 'portrait_image'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 3. Handle the file upload logic
        $data = $request->except('portrait_image'); // Get all data except the image itself

        if ($request->hasFile('portrait_image')) {
            // Store the image in 'storage/app/public/portraits' and get its path
            $path = $request->file('portrait_image')->store('portraits', 'public');
            $data['portrait_url'] = $path; // Add the file path to our data array to be saved in the DB
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
        // 4. Update validation for the update method as well
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'portrait_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 5. Handle the file update logic
        $data = $request->except('portrait_image');

        if ($request->hasFile('portrait_image')) {
            // If an old portrait exists, delete it to save space
            if ($person->portrait_url) {
                Storage::disk('public')->delete($person->portrait_url);
            }
            // Store the new image and get its path
            $path = $request->file('portrait_image')->store('portraits', 'public');
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
        // 6. Add logic to delete the associated image file when a person is deleted
        if ($person->portrait_url) {
            Storage::disk('public')->delete($person->portrait_url);
        }
        
        $person->delete();

        return response()->json(['message' => 'Person deleted successfully.']);
    }
}