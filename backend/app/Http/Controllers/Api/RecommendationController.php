<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Person;
use App\Models\Place;
use App\Models\Event;

class RecommendationController extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            
            // ===================================================================
            // --- NEW LOGIC: SHOW EXACTLY WHAT THE USER HAS LIKED ---
            // ===================================================================

            /** @var \App\Models\User $user */
            $user = Auth::user();

            // 1. Get all articles the user has liked, directly from the relationships.
            $likedPeople = $user->likedPeople;
            $likedPlaces = $user->likedPlaces;
            $likedEvents = $user->likedEvents;

            // 2. Combine all liked items into a single collection.
            $allLikedItems = collect([])
                ->concat($likedPeople)
                ->concat($likedPlaces)
                ->concat($likedEvents);

            // 3. If the user has no liked items, return an empty array.
            if ($allLikedItems->isEmpty()) {
                return response()->json([]);
            }

            // 4. Shuffle the list and take a sample to display. This ensures the
            //    order changes if the user has more than 7 liked items.
            $finalRecommendations = $allLikedItems->shuffle()->take(7);
            
            // 5. Format the data for the frontend.
            $formatted = $finalRecommendations->map(function ($item) {
                $type = strtolower(class_basename($item));
                $linkType = ($type === 'person') ? 'figures' : $type . 's';
                return [
                    'title' => $item->name,
                    'image_url' => $item->picture ? asset('storage/' . $item->picture) : null,
                    'link' => "/{$linkType}/{$item->id}",
                ];
            });

            return response()->json($formatted->values());

        } else {
            // GUEST LOGIC (Remains unchanged)
            $popularPeople = Person::withCount('likers')->orderBy('likers_count', 'desc')->limit(15)->get();
            $popularPlaces = Place::withCount('likers')->orderBy('likers_count', 'desc')->limit(15)->get();
            $popularEvents = Event::withCount('likers')->orderBy('likers_count', 'desc')->limit(15)->get();
            
            $allItems = $popularPeople->concat($popularPlaces)->concat($popularEvents);
            $sortedItems = $allItems->sortByDesc(function ($item) { return (int)$item->likers_count; });
            $recommendedItems = $sortedItems->take(7);
            
            $formatted = $recommendedItems->map(function ($item) {
                $type = strtolower(class_basename($item));
                $linkType = ($type === 'person') ? 'figures' : $type . 's';
                return [
                    'title' => $item->name,
                    'image_url' => $item->picture ? asset('storage/' . $item->picture) : null,
                    'link' => "/{$linkType}/{$item->id}",
                ];
            });

            return response()->json($formatted->values());
        }
    }
}