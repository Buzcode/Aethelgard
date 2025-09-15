<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PopularityController extends Controller
{
    /**
     * Get the most popular items across all categories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $limit = 8; // You can still change this number

        // Query for People (Figures)
        // THE FIX: Use CONCAT to build the full image path
        $people = DB::table('people')
            ->select(
                'id',
                'name',
                DB::raw("CONCAT('/storage/', portrait_url) as image"), // <-- CHANGED
                'likes',
                DB::raw("'figure' as type")
            );

        // Query for Events
        // THE FIX: Use CONCAT to build the full image path
        $events = DB::table('events')
            ->select(
                'id',
                'name',
                DB::raw("CONCAT('/storage/', picture) as image"), // <-- CHANGED
                'likes',
                DB::raw("'event' as type")
            );

        // Query for Places
        // THE FIX: Use CONCAT to build the full image path
        $places = DB::table('places')
            ->select(
                'id',
                'name',
                DB::raw("CONCAT('/storage/', picture) as image"), // <-- CHANGED
                'likes',
                DB::raw("'place' as type")
            )
            ->union($people)
            ->union($events);

        // This part remains the same
        $popularItems = DB::query()
            ->fromSub($places, 'popular_items')
            ->orderBy('likes', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($popularItems);
    }
}