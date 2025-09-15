<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Person;
use App\Models\Place;
use Illuminate\Support\Facades\Auth; // <-- Make sure Auth is imported

class SearchController extends Controller
{
    public function search(Request $request)
    {
        // We will use 'query' as the parameter name to match your frontend
        $searchTerm = $request->input('query');
        if (!$searchTerm) {
            return response()->json(['message' => 'Search query is required.'], 400);
        }

        // --- Build Queries with Like Counts and Status ---
        $eventsQuery = Event::query()->withCount('likers as likes');
        $peopleQuery = Person::query()->withCount('likers as likes');
        $placesQuery = Place::query()->withCount('likers as likes');

        if (Auth::check()) {
            $userId = Auth::id();
            $eventsQuery->withExists(['likers as is_liked' => fn($q) => $q->where('user_id', $userId)]);
            $peopleQuery->withExists(['likers as is_liked' => fn($q) => $q->where('user_id', $userId)]);
            $placesQuery->withExists(['likers as is_liked' => fn($q) => $q->where('user_id', $userId)]);
        }

        // --- Fetch Results based on name OR description/bio ---
        $events = $eventsQuery->where('name', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                              ->get();
        $people = $peopleQuery->where('name', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('bio', 'LIKE', "%{$searchTerm}%")
                              ->get();
        $places = $placesQuery->where('name', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                              ->get();

        // --- Add a 'type' identifier to each item ---
        $events->each(fn($item) => $item->type = 'events');
        $people->each(fn($item) => $item->type = 'people');
        $places->each(fn($item) => $item->type = 'places');

        // --- Combine all results ---
        $allResults = $events->concat($people)->concat($places);

        // --- Sort results by relevance (exact matches first) ---
        $sortedResults = $allResults->sortByDesc(function ($item) use ($searchTerm) {
            $score = 0;
            $itemNameLower = strtolower($item->name);
            $searchTermLower = strtolower($searchTerm);
            if ($itemNameLower === $searchTermLower) $score = 10;
            elseif (str_starts_with($itemNameLower, $searchTermLower)) $score = 5;
            else $score = 1;
            return $score;
        })->values();

        return response()->json($sortedResults);
    }
}