<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\Request;

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
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'picture' => 'nullable|string',
        ]);

        $place = Place::create($validatedData);

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
        $validatedData = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'latitude' => 'sometimes|required|numeric|between:-90,90',
        'longitude' => 'sometimes|required|numeric|between:-180,180',
        'description' => 'nullable|string',
        'picture' => 'nullable|string',
    ]);

    $place->update($validatedData);

    return response()->json($place);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Place $place)
    {
         $place->delete();

    return response()->json(null, 204);                                              
    }
}