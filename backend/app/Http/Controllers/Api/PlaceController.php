<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PlaceController extends Controller
{
    public function index(Request $request) //MODIFIED: Injected Request
    {
        // Start with a base query builder instance
        $query = Place::query();

        // Check if a 'category' parameter exists in the URL
        if ($request->has('category')) {
            // If it exists, add a WHERE clause to filter the results
            $query->where('category', $request->input('category'));
        }

        // Execute the query and get the results
        $places = $query->get();

        // Return the collection of places as JSON
        return response()->json($places);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
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
        return $place;
    }



    public function update(Request $request, Place $place)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'latitude' => 'sometimes|required|numeric|between:-90,90',
            'longitude' => 'sometimes|required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'picture' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('picture'); 

        if ($request->hasFile('picture')) { 
            if ($place->picture) {
                Storage::disk('public')->delete($place->picture);
            }
            $path = $request->file('picture')->store('places', 'public'); 
            $data['picture'] = $path;
        }

        $place->update($data);

        return response()->json($place);
    }

    public function destroy(Place $place)
    {
        if ($place->picture) {
            Storage::disk('public')->delete($place->picture);
        }
        
        $place->delete();

        return response()->json(null, 204);                                              
    }
}