<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // MODIFICATION: Removed withCount('likers') as we now have a dedicated likes_count column.
        $query = Event::query();

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }
        $events = $query->get();

        if (Auth::check()) {
            /** @var \App\Models\User $user */
            $user = Auth::user();

            $likedEventIds = $user->likedEvents()->pluck('events.id')->toArray();
            $events->each(function ($event) use ($likedEventIds) {
                $event->is_liked = in_array($event->id, $likedEventIds);
            });
        }

        return response()->json($events);
    }

    /**
     * Toggle a like and update the likes_count.
     */
    public function updateLikes(Request $request, Event $event)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        
        // --- NEW LOGIC TO UPDATE COUNT ---
        $result = $user->likedEvents()->toggle($event->id);

        // If a like was added, increment the count.
        if (!empty($result['attached'])) {
            $event->increment('likes_count');
        } else {
            // Otherwise, a like was removed, so decrement.
            $event->decrement('likes_count');
        }

        return response()->json(['status' => 'success', 'message' => 'Like status updated.']);
    }

    // --- Other methods remain the same ---

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'event_date' => 'nullable|date',
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            $data = $validatedData;
            if ($request->hasFile('picture')) {
                $path = $request->file('picture')->store('events', 'public');
                $data['picture'] = $path;
            }
            $event = Event::create($data);
            return response()->json($event, 201);
        } catch (ValidationException $e) { return response()->json(['message' => 'Validation Failed', 'errors' => $e->errors()], 422); }
        catch (\Exception $e) { return response()->json(['message' => 'Failed to create event', 'error' => $e->getMessage()], 500); }
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        return response()->json($event);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                'event_date' => 'nullable|date',
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            $data = $validatedData;
            if ($request->hasFile('picture')) {
                if ($event->picture) { Storage::disk('public')->delete($event->picture); }
                $path = $request->file('picture')->store('events', 'public');
                $data['picture'] = $path;
            }
            $event->update($data);
            return response()->json($event);
        } catch (ValidationException $e) { return response()->json(['message' => 'Validation Failed', 'errors' => $e->errors()], 422); }
        catch (\Exception $e) { return response()->json(['message' => 'Failed to update event', 'error' => $e->getMessage()], 500); }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        if ($event->picture) { Storage::disk('public')->delete($event->picture); }
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }
}