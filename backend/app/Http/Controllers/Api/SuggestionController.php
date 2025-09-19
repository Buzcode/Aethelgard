<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Person;
use App\Models\Place;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    /**
     * Fetch search suggestions based on a query.
     */
    public function fetch(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string|max:255',
        ]);
        $searchTerm = $validated['query'];

        // If the search term is too short, return no results
        if (strlen($searchTerm) < 2) {
            return response()->json([]);
        }

        // Search for people
        $people = Person::where('name', 'LIKE', "%{$searchTerm}%")
            ->limit(4) // Limit the number of results to keep the response fast
            ->get(['id', 'name'])
            ->map(fn($item) => ['id' => $item->id, 'title' => $item->name, 'type' => 'figures']);

        // Search for events
        $events = Event::where('name', 'LIKE', "%{$searchTerm}%")
            ->limit(4)
            ->get(['id', 'name'])
            ->map(fn($item) => ['id' => $item->id, 'title' => $item->name, 'type' => 'events']);

        // Search for places
        $places = Place::where('name', 'LIKE', "%{$searchTerm}%")
            ->limit(4)
            ->get(['id', 'name'])
            ->map(fn($item) => ['id' => $item->id, 'title' => $item->name, 'type' => 'places']);

        // Combine all results
        $allSuggestions = $people->concat($events)->concat($places);
        
        // Sort the results to give priority to matches at the beginning of the string
        $sortedSuggestions = $allSuggestions->sortBy(function ($item) use ($searchTerm) {
            // Give a higher score (lower number) if the name starts with the search term
            return str_starts_with(strtolower($item['title']), strtolower($searchTerm)) ? 0 : 1;
        })->values();

        return response()->json($sortedSuggestions);
    }
}