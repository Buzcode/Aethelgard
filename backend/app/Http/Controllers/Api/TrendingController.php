<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Person;
use App\Models\Place;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class TrendingController extends Controller
{
    public function index()
    {
        try {
            $topLogs = DB::table('search_logs')
                ->select('loggable_id', 'loggable_type', DB::raw('COUNT(*) as search_count'))
                ->where('created_at', '>=', now()->subDays(5))
                ->groupBy('loggable_id', 'loggable_type')
                ->having('search_count', '>=', 5)
                ->orderByDesc('search_count')
                ->limit(5)
                ->get();

            $trendingTopics = $topLogs->map(function ($log) {
                // === THIS IS THE MODIFIED SECTION ===
                $modelClass = match ($log->loggable_type) {
                    'App\Models\Person' => Person::class,
                    'App\Models\Place'  => Place::class,
                    'App\Models\Event'  => Event::class,
                    default             => null,
                };

                // Determine the 'type' for the URL based on the model class
                $type = match ($modelClass) {
                    Person::class => 'people', // Use 'people' to match your route
                    Place::class  => 'places',
                    Event::class  => 'events',
                    default       => null,
                };

                if (is_null($modelClass) || is_null($type)) {
                    Log::warning('Unexpected loggable_type in search_logs: ' . $log->loggable_type);
                    return null;
                }
                
                $item = $modelClass::find($log->loggable_id);

                if (!$item) return null;
                
                return [
                    'id'    => $item->id,
                    'title' => $item->name,
                    'type'  => $type, // This will now be 'people', 'places', or 'events'
                ];
                // === END OF MODIFIED SECTION ===
            })->filter()->values();

            return response()->json($trendingTopics);

        } catch (Throwable $e) {
            report($e);
            return response()->json(['error' => 'Could not fetch trending topics.'], 500);
        }
    }
}