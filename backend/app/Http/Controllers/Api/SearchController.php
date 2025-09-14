<?php

namespace App\Http\Controllers\Api; // Important: Match your API controllers namespace

use App\Http\Controllers\Controller;
use App\Models\Person; // Use singular 'Person' model
use App\Models\Event;  // Use singular 'Event' model
use App\Models\Place;  // Use singular 'Place' model
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q'); // Get the search term from the 'q' query parameter
        $limit = $request->input('limit', 10); // Limit the number of results, default to 10

        // If no query is provided, return an empty array
        if (!$query) {
            return response()->json([]);
        }

        $results = collect(); // Initialize a collection to hold all search results

        // Search in the 'Person' model (for historical figures)
        $people = Person::where('name', 'LIKE', '%' . $query . '%') // Search by name
                        ->select('id', 'name', 'category') // Select necessary fields
                        ->limit($limit)
                        ->get()
                        ->map(function ($item) {
                            $item->type = 'people'; // Add 'type' for frontend routing (e.g., /people/{id})
                            return $item;
                        });
        $results = $results->concat($people); // Add people results to the main collection

        // Search in the 'Event' model (for historical events)
        $events = Event::where('name', 'LIKE', '%' . $query . '%') // Search by name
                        ->select('id', 'name', 'category') // Select necessary fields
                        ->limit($limit)
                        ->get()
                        ->map(function ($item) {
                            $item->type = 'events'; // Add 'type' for frontend routing (e.g., /events/{id})
                            return $item;
                        });
        $results = $results->concat($events); // Add events results to the main collection

        // Search in the 'Place' model (for historical places)
        $places = Place::where('name', 'LIKE', '%' . $query . '%') // Search by name
                       ->select('id', 'name', 'category') // Select necessary fields
                       ->limit($limit)
                       ->get()
                       ->map(function ($item) {
                           $item->type = 'places'; // Add 'type' for frontend routing (e.g., /places/{id})
                           return $item;
                       });
        $results = $results->concat($places); // Add places results to the main collection

        // Combine, ensure uniqueness by ID (in case multiple categories match), sort by name, and limit total results
        $sortedResults = $results->unique('id')->sortBy('name')->take($limit);

        return response()->json($sortedResults);
    }
}