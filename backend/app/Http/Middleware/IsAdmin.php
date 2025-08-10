<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
 
class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
{
    // Check if the user is authenticated and if their role is 'admin'
    if (auth()->check() && auth()->user()->role == 'admin') {
        // If they are an admin, allow the request to proceed to the controller
        return $next($request);
    }
 
    // If not an admin, block the request and return a 'Forbidden' error
    return response()->json(['message' => 'Forbidden: You do not have administrative access.'], 403);
}
}
