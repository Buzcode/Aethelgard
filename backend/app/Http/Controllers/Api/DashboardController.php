<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Person;
use App\Models\Place;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Fetch all articles from all types for the admin dashboard.
     */
    public function index()
    {
        // Fetch all items and add a 'type' to identify them on the frontend
        $people = Person::latest()->get()->map(function ($item) {
            $item->type = 'FIGURES';
            return $item;
        });

        $places = Place::latest()->get()->map(function ($item) {
            $item->type = 'PLACES';
            return $item;
        });

        $events = Event::latest()->get()->map(function ($item) {
            $item->type = 'EVENTS';
            return $item;
        });

        // Merge the three collections into one
        $allArticles = $people->concat($places)->concat($events);

        // Sort the combined collection by the creation date, newest first
        $sortedArticles = $allArticles->sortByDesc('created_at')->values();

        return response()->json($sortedArticles);
    }
}