<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PlaceController extends Controller
{
    public function index(Request $request)
    {
        $query = Place::query();
        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }
        $places = $query->get();
        return response()->json($places);
    }

    public function store(Request $request)
    {
        // --- MODIFICATION START ---
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255', // Added category validation
            'latitude' => 'nullable|numeric|between:-90,90', // Changed to nullable
            'longitude' => 'nullable|numeric|between:-180,180', // Changed to nullable
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
        ]);
        // --- MODIFICATION END ---

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
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255', // Also added here
            'latitude' => 'sometimes|nullable|numeric|between:-90,90',
            'longitude' => 'sometimes|nullable|numeric|between:-180,180',
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