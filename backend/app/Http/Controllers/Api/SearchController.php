<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Person;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // Good practice to import this
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        // ... (validation and query setup remains the same) ...
        $validated = $request->validate([
            'query' => 'required|string|max:255',
        ]);
        $searchTerm = $validated['query'];

        $eventsQuery = Event::query()->withCount('likers as likes');
        $peopleQuery = Person::query()->withCount('likers as likes');
        $placesQuery = Place::query()->withCount('likers as likes');

        if (Auth::check()) {
            $userId = Auth::id();
            $eventsQuery->withExists(['likers as is_liked' => fn($q) => $q->where('user_id', $userId)]);
            $peopleQuery->withExists(['likers as is_liked' => fn($q) => $q->where('user_id', 'LIKE', $userId)]);
            $placesQuery->withExists(['likers as is_liked' => fn($q) => $q->where('user_id', 'LIKE', $userId)]);
        }

        $events = $eventsQuery->where('name', 'LIKE', "%{$searchTerm}%")->get();
        $people = $peopleQuery->where('name', 'LIKE', "%{$searchTerm}%")->get();
        $places = $placesQuery->where('name', 'LIKE', "%{$searchTerm}%")->get();


        $events->each(fn($item) => $item->type = 'events');
        $people->each(fn($item) => $item->type = 'figures');
        $places->each(fn($item) => $item->type = 'places');

        $allResults = $events->concat($people)->concat($places);

        $sortedResults = $allResults->sortByDesc(function ($item) use ($searchTerm) {
            $score = 0;
            
            // --- FIX 1: Use the correct '->' accessor ---
            $itemNameLower = strtolower($item->name);
            $searchTermLower = strtolower($searchTerm);

            if ($itemNameLower === $searchTermLower) {
                $score = 10;
            } elseif (str_starts_with($itemNameLower, $searchTermLower)) {
                $score = 5;
            } else {
                $score = 1;
            }
            return $score;
        })->values();

        // --- FIX 2: Use the standard JSON response syntax ---
        return response()->json($sortedResults);
    }
}