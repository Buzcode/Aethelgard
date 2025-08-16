<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Event::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate incoming data, expecting an 'event_image' file
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'event_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        
        $data = $request->except('event_image');

        if ($request->hasFile('event_image')) {
            // Store the image in 'public/events' directory
            $path = $request->file('event_image')->store('events', 'public');
            // Save the path to the 'picture' field in the database
            $data['picture'] = $path;
        }

        $event = Event::create($data);

        return response()->json($event, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        return $event;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        // 3. Update validation for the update method
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'event_date' => 'sometimes|required|date',
            'event_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 4. Handle the file update logic
        $data = $request->except('event_image');

        if ($request->hasFile('event_image')) {
            if ($event->picture) {
                Storage::disk('public')->delete($event->picture);
            }
            $path = $request->file('event_image')->store('events', 'public');
            $data['picture'] = $path;
        }

        $event->update($data);

        return response()->json($event);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        // 5. Delete the associated image file from storage
        if ($event->picture) {
            Storage::disk('public')->delete($event->picture);
        }
        
        $event->delete();

        return response()->json(null, 204);
    }
}