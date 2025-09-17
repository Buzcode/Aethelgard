<?php

// --- VERIFY THE NAMESPACE ---
namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Person;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

// --- VERIFY THE CLASS NAME ---
class TrackingController extends Controller 
{
    /**
     * Log a click on a specific article to count it for trending topics.
     */
    public function logClick(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'string', Rule::in(['people', 'places', 'events'])],
            'id'   => 'required|integer',
        ]);

        $modelClass = match ($validated['type']) {
            'people' => Person::class,
            'places' => Place::class,
            'events' => Event::class,
        };

        $item = $modelClass::find($validated['id']);

        if ($item) {
            $item->searchLogs()->create(['search_term' => null]);
            return response()->json(['message' => 'Click logged successfully.'], 200);
        }

        return response()->json(['message' => 'Item not found.'], 404);
    }
}