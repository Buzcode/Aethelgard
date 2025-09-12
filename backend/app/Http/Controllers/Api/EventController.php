<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query();
        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }
        $events = $query->get();
        return response()->json($events);
    }

    public function store(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255', // Added category validation
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
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255', 
            'event_date' => 'nullable|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

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