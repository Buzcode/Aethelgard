<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PersonController;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\PopularityController;
use App\Http\Controllers\Api\TrendingController;
use App\Http\Controllers\Api\SuggestionController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Api\SavedArticleController;
use App\Http\Controllers\Api\RecommendationController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Public Authentication Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// --- Other Public Routes ---
Route::get('/search', [SearchController::class, 'search']);
Route::get('/suggestions', [SuggestionController::class, 'fetch']);
Route::post('/track-click', [TrackingController::class, 'logClick']);
Route::get('/trending-topics', [TrendingController::class, 'index']);
Route::get('/popular-items', [PopularityController::class, 'index']);
Route::post('/chat', [ChatController::class, 'handleChat']);
Route::get('/recommendations', [RecommendationController::class, 'index']);


// --- Public Read-Only Content Routes ---
Route::middleware('auth.optional')->group(function () {
    // --- This is the correct fix ---
    Route::get('/figures', [PersonController::class, 'index']);
    Route::get('/figures/{person}', [PersonController::class, 'show']);

    Route::get('/places', [PlaceController::class, 'index']);
    Route::get('/places/{place}', [PlaceController::class, 'show']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);
});


// --- Protected User and Admin Routes ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- LIKES & SAVES ROUTES (MUST STAY PROTECTED) ---
    Route::post('/figures/{person}/like', [PersonController::class, 'updateLikes']);
    Route::post('/events/{event}/like', [EventController::class, 'updateLikes']);
    Route::post('/places/{place}/like', [PlaceController::class, 'updateLikes']);
    Route::get('/saved-articles', [SavedArticleController::class, 'index']);
    Route::post('/saved-articles/toggle', [SavedArticleController::class, 'toggleSave']);

    // --- Admin-Only "Write" Routes ---
    Route::middleware('is.admin')->group(function () {
        Route::get('/articles', [DashboardController::class, 'index']);
        Route::apiResource('figures', PersonController::class)->except(['index', 'show']);
        Route::apiResource('places', PlaceController::class)->except(['index', 'show']);
        Route::apiResource('events', EventController::class)->except(['index', 'show']);
    });
});

// Example test route if you still need it
Route::get('/testkey', function () {
    return response()->json(['message' => 'API key is working']);
});