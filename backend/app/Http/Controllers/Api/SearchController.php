<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Person;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function search(Request $request)
    {
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

        $events = $eventsQuery->where('name', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                              ->get();
        $people = $peopleQuery->where('name', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('bio', 'LIKE', "%{$searchTerm}%")
                              ->get();
        $places = $placesQuery->where('name', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                              ->get();

        $events->each(fn($item) => $item->type = 'events');
        $people->each(fn($item) => $item->type = 'people');
        $places->each(fn($item) => $item->type = 'places');

        $allResults = $events->concat($people)->concat($places);

        $sortedResults = $allResults->sortByDesc(function ($item) use ($searchTerm) {
            $score = 0;
            $itemNameLower = strtolower($item->name);
            $searchTermLower = strtolower($searchTerm);
            if ($itemNameLower === $searchTermLower) $score = 10;
            elseif (str_starts_with($itemNameLower, $searchTermLower)) $score = 5;
            else $score = 1;
            return $score;
        })->values();

        // --- THE OLD SEARCH LOGGING SYSTEM HAS BEEN REMOVED FROM THIS SECTION ---

        return response()->json($sortedResults);
    }
}