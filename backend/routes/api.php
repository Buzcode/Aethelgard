<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PersonController;
use App\Http\Controllers\Api\PlaceController; 
use App\Http\Controllers\Api\EventController; 

// --- Public Authentication Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Public Content Routes ---
// Read-Only
Route::get('/people', [PersonController::class, 'index']);
Route::get('/people/{person}', [PersonController::class, 'show']);

Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/{place}', [PlaceController::class, 'show']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);

// MOVED FOR TESTING: Temporarily made public to allow adding test data.
Route::post('/places', [PlaceController::class, 'store']);
Route::post('/events', [EventController::class, 'store']);


// --- Protected Admin & User Routes ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- Admin-Only "Write" Routes ---
    Route::middleware('is.admin')->group(function () {
        // People
        Route::post('/people', [PersonController::class, 'store']);
        Route::put('/people/{person}', [PersonController::class, 'update']);
        Route::delete('/people/{person}', [PersonController::class, 'destroy']);
        
        // Places
        // The POST route was moved to the public section for testing.
        Route::put('/places/{place}', [PlaceController::class, 'update']);
        Route::delete('/places/{place}', [PlaceController::class, 'destroy']);
        
        // Events
        // The POST route was moved to the public section for testing.
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);
    });
});