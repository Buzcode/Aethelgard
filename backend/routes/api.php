<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PersonController;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\EventController;

// --- Public Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// --- Protected Routes ---
Route::middleware('auth:sanctum')->group(function () {
    // Standard authenticated user routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin-Only Routes
    Route::middleware('is.admin')->group(function() {
        Route::apiResource('people', PersonController::class);
        Route::apiResource('places', PlaceController::class);
        Route::apiResource('events', EventController::class);
    });
});
