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
    public function index(Request $request) //Injected Request
    {
        // base query builder instance
        $query = Event::query();

        // Check if a 'category' parameter exists in the URL
        if ($request->has('category')) {
            // add a WHERE clause to filter the results
            $query->where('category', $request->input('category'));
        }

        // Execute the query (original or filtered one) and get the results
        $events = $query->get();

        // Return the collection of events as JSON
        return response()->json($events);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'nullable|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('picture');

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('events', 'public');
            $data['picture'] = $path;
        }

        $event = Event::create($data);

        return response()->json($event, 201);
    }

    public function update(Request $request, Event $event)
    {
        // Validation...
        $data = $request->except('picture');

        if ($request->hasFile('picture')) {
            if ($event->picture) {
                Storage::disk('public')->delete($event->picture);
            }
            $path = $request->file('picture')->store('events', 'public');
            $data['picture'] = $path;
        }

        $event->update($data);
        return response()->json($event);
    }
}