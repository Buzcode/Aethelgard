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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Public Authentication Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Public Read-Only Content Routes ---
// THE FIXED: We apply new 'auth.optional' middleware to these routes.
// Now, guests can view them, and logged-in users will be recognized.
Route::get('/people', [PersonController::class, 'index'])->middleware('auth.optional');
Route::get('/people/{person}', [PersonController::class, 'show'])->middleware('auth.optional');

Route::get('/places', [PlaceController::class, 'index'])->middleware('auth.optional');
Route::get('/places/{place}', [PlaceController::class, 'show'])->middleware('auth.optional');

Route::get('/events', [EventController::class, 'index'])->middleware('auth.optional');
Route::get('/events/{event}', [EventController::class, 'show'])->middleware('auth.optional');
Route::get('/search', [SearchController::class, 'search']); // <-- ADD THIS NEW ROUTE

Route::get('/people', [PersonController::class, 'index'])->middleware('auth.op
Route::get('/popular-items', [PopularityController::class, 'index']);

// --- Protected User and Admin Routes ---
// These routes still REQUIRE authentication.
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- LIKES ROUTES (MUST STAY PROTECTED) ---
    Route::post('/people/{person}/like', [PersonController::class, 'updateLikes']);
    Route::post('/events/{event}/like', [EventController::class, 'updateLikes']);
    Route::post('/places/{place}/like', [PlaceController::class, 'updateLikes']);

    // --- Admin-Only "Write" Routes ---
    Route::middleware('is.admin')->group(function () {
        Route::get('/articles', [DashboardController::class, 'index']);
        Route::apiResource('people', PersonController::class)->except(['index', 'show']);
        Route::apiResource('places', PlaceController::class)->except(['index', 'show']);
        Route::apiResource('events', EventController::class)->except(['index', 'show']);
    });
});


// --- Other Public Routes ---
Route::post('/chat', [ChatController::class, 'handleChat']);
Route::get('/testkey', function () { /* ... */ });