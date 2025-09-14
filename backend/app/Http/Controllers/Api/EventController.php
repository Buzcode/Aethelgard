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
        
        $query = Event::query();

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        // Always get the true likes count from the relationship.
        // We alias it to 'likes' to match your frontend's expectation.
        $query->withCount('likers as likes');

        // If a user is logged in, efficiently check if they have liked each event.
        if (Auth::check()) {
            $query->withExists(['likers as is_liked' => function ($query) {
                $query->where('user_id', Auth::id());
            }]);
        }
        
        $events = $query->latest()->get();

        return response()->json($events);
    }

    /**
     * Toggle a like and return the new state.
     * This is now safe from race conditions and uses the source of truth for counts.
     */
      public function updateLikes(Request $request, Event $event)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Toggle the relationship in the pivot table (the source of truth)
        $user->likedEvents()->toggle($event->id);

        // Recalculate the count from the source of truth
        $newLikesCount = $event->likers()->count();
        
        // Save the new count to our cached 'likes' column
        $event->update(['likes' => $newLikesCount]);

        // Determine the new liked status
        $isLiked = $user->likedEvents()->where('event_id', $event->id)->exists();

        // Return the fresh data to the frontend
        return response()->json([
            'new_likes_count' => $newLikesCount,
            'is_liked' => $isLiked,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        // Add the 'likes' count and let the model accessor handle 'is_liked'.
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
       /**
     * Update the specified resource in storage.
     * THIS IS THE CORRECTED VERSION.
     */
    public function update(Request $request, Event $event)
    {
        try {
            // First, validate the text-based fields.
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                // Add any other text/select fields here (e.g., subcategory, status)
            ]);

            // Validate the image separately.
            $request->validate([
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Start building the data array with the text fields.
            $dataToUpdate = $validatedData;

            // Now, handle the file upload with explicit logic.
            // This block will only run if a new file is actually chosen.
            if ($request->hasFile('picture')) {
                // 1. Delete the old picture if it exists to save space.
                if ($event->picture) {
                    Storage::disk('public')->delete($event->picture);
                }
                
                // 2. Store the new picture and get its path.
                $path = $request->file('picture')->store('events', 'public');
                
                // 3. Only add the 'picture' key to our data array if a new file was stored.
                $dataToUpdate['picture'] = $path;
            }

            // Perform the update. The 'picture' field is only updated if a new file was uploaded.
            // Otherwise, it remains untouched in the database.
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