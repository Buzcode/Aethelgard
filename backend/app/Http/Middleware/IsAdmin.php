<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // 1. Import the Auth facade
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response // I've also added the Response return type for best practice
    {
        // 2. Use the Auth facade to check if the user is authenticated and if their role is 'admin'
        if (Auth::check() && Auth::user()->role == 'admin') {
            // If they are an admin, allow the request to proceed to the controller
            return $next($request);
        }

        // If not an admin, block the request and return a 'Forbidden' error
        return response()->json(['message' => 'Forbidden: You do not have administrative access.'], 403);
    }
}