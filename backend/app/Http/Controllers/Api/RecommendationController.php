<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Person;
use App\Models\Place;
use App\Models\Event;

class RecommendationController extends Controller
{
    public function index()
    {
        // --- LOGIC TO SHOW RECOMMENDATIONS BASED ON LIKES AND SAVES ---

        // 1. Get a pool of the MOST POPULAR items from each category.
        $popularPeople = Person::withCount(['likers', 'saves'])->orderBy('likers_count', 'desc')->limit(15)->get();
        $popularPlaces = Place::withCount(['likers', 'saves'])->orderBy('likers_count', 'desc')->limit(15)->get();
        $popularEvents = Event::withCount(['likers', 'saves'])->orderBy('likers_count', 'desc')->limit(15)->get();

        // 2. Combine all items into a single collection.
        $allItems = $popularPeople->concat($popularPlaces)->concat($popularEvents);

        // 3. Sort the combined collection by the total popularity score.
        // --- FIX: Explicitly cast counts to integers to prevent sorting errors with null values. ---
        $sortedItems = $allItems->sortByDesc(function ($item) {
            // This ensures we are always adding numbers (e.g., 4 + 0).
            return (int)$item->likers_count + (int)$item->saves_count;
        });

        // 4. Take the top 7 most popular items from the final sorted list.
        $recommendedItems = $sortedItems->take(7);

        // 5. Format the final list for the frontend.
        $formatted = $recommendedItems->map(function ($item) {
            $type = strtolower(class_basename($item));
            $linkType = ($type === 'person') ? 'figures' : $type . 's';

            return [
                'title' => $item->name,
                'image_url' => $item->picture ? asset('storage/' . $item->picture) : null,
                'link' => "/{$linkType}/{$item->id}",
            ];
        });

        // Return the formatted recommendations as a JSON response.
        return response()->json($formatted->values());
    }
}