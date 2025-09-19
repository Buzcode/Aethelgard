<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB; // <-- ADDED FOR TRANSACTIONS

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        $query = Event::query();

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        $query->withCount('likers as likes');

        if (Auth::check()) {
            $query->withExists(['likers as is_liked' => function ($query) {
                $query->where('user_id', Auth::id());
            }]);
        }
        
        $events = $query->latest()->get();

        return response()->json($events);
    }

    /**
     * THIS FUNCTION HAS BEEN UPDATED FOR RELIABILITY
     * Toggles the like status and ensures data consistency with a transaction.
     */
    public function updateLikes(Request $request, Event $event)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Using a transaction ensures that both the pivot table and the cached
        // likes count are updated together, or not at all if an error occurs.
        return DB::transaction(function () use ($user, $event) {
            // 1. Toggle the relationship in the pivot table (the source of truth).
            $user->likedEvents()->toggle($event->id);

            // 2. Recalculate the count directly from the relationship.
            $newLikesCount = $event->likers()->count();
            
            // 3. Update the cached 'likes' column on the events table.
            $event->update(['likes' => $newLikesCount]);

            // 4. Check the new "liked" status for the current user.
            $isLiked = $user->likedEvents()->where('event_id', $event->id)->exists();

            // 5. Return the fresh, reliable data to the frontend.
            return response()->json([
                'new_likes_count' => $newLikesCount,
                'is_liked' => $isLiked,
            ]);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        $event->loadCount('likers as likes');
        return response()->json($event);
    }

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
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:255',
            ]);
            $request->validate([
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            $dataToUpdate = $validatedData;
            if ($request->hasFile('picture')) {
                if ($event->picture) {
                    Storage::disk('public')->delete($event->picture);
                }
                $path = $request->file('picture')->store('events', 'public');
                $dataToUpdate['picture'] = $path;
            }
            $event->update($dataToUpdate);
            return response()->json($event);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validation Failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update event', 'error' => $e->getMessage()], 500);
        }
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