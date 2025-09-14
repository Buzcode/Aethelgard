<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PersonController;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// --- Public Authentication Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Public Read-Only Content Routes ---
Route::get('/people', [PersonController::class, 'index']);
Route::get('/people/{person}', [PersonController::class, 'show']);

Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/{place}', [PlaceController::class, 'show']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);


// --- Protected User and Admin Routes ---
// Routes within this group require a valid Sanctum authentication token.
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- LIKES ROUTES (MOVED & CORRECTED) ---
    // These routes MUST be protected to know which user is liking the item.
    // They are now standardized to use '/like' for consistency with your frontend code.
    Route::post('/people/{person}/like', [PersonController::class, 'updateLikes']);
    Route::post('/events/{event}/like', [EventController::class, 'updateLikes']);
    Route::post('/places/{place}/like', [PlaceController::class, 'updateLikes']);

    // --- Admin-Only "Write" Routes ---
    // These routes are further protected and can only be accessed by authenticated admins.
    Route::middleware('is.admin')->group(function () {
        Route::get('/articles', [DashboardController::class, 'index']);

        // People Resource Routes (Create, Update, Delete)
        Route::apiResource('people', PersonController::class)->except(['index', 'show']);

        // Places Resource Routes (Create, Update, Delete)
        Route::apiResource('places', PlaceController::class)->except(['index', 'show']);

        // Events Resource Routes (Create, Update, Delete)
        Route::apiResource('events', EventController::class)->except(['index', 'show']);
    });
});


// --- Other Public Routes ---
Route::post('/chat', [ChatController::class, 'handleChat']);

Route::get('/testkey', function () {
    // This is a debug route to check your Gemini API key.
    $key = config('gemini.api_key');
    dd($key); // dd means "Dump and Die"
});