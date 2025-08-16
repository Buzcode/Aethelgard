<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator; // Import Validator

class PlaceController extends Controller
{
   
    public function index()
    {
        return Place::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate incoming data, expecting a 'place_image' file
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'place_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Expects a file named 'place_image'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        // 2. Handle the file upload
        $data = $request->except('place_image'); // Get all data except the image file itself

        if ($request->hasFile('place_image')) {
            // Store the image in 'public/places' directory
            $path = $request->file('place_image')->store('places', 'public');
            // Save the path to the 'picture' field in the database
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
        // 3. Update validation for the update method
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'latitude' => 'sometimes|required|numeric|between:-90,90',
            'longitude' => 'sometimes|required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'place_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 4. Handle the file update logic
        $data = $request->except('place_image');

        if ($request->hasFile('place_image')) {
            // If an old picture exists, delete it
            if ($place->picture) {
                Storage::disk('public')->delete($place->picture);
            }
            // Store the new image
            $path = $request->file('place_image')->store('places', 'public');
            // Update the 'picture' field with the new path
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
        // 5. Delete the associated image file from storage when a place is deleted
        if ($place->picture) {
            Storage::disk('public')->delete($place->picture);
        }
        
        $place->delete();

        return response()->json(null, 204);
    }
}