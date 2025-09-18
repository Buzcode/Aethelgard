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
        $limit = 8; 

        // Query for People (Figures)
        $people = DB::table('people')
            ->select(
                'id',
                'name',
                // ====================================================================
                // --- THIS IS THE CORRECTED LINE ---
                DB::raw("CONCAT('/storage/', picture) as image"), 
                // ====================================================================
                'likes',
                DB::raw("'figure' as type")
            );

        // Query for Events
        $events = DB::table('events')
            ->select(
                'id',
                'name',
                DB::raw("CONCAT('/storage/', picture) as image"),
                'likes',
                DB::raw("'event' as type")
            );

        // Query for Places
        $places = DB::table('places')
            ->select(
                'id',
                'name',
                DB::raw("CONCAT('/storage/', picture) as image"),
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