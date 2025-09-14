<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class OptionalAuthSanctum
{
    /**
     * Handle an incoming request.
     *
     * This middleware will check for a Sanctum API token. If a valid token is
     * found, it will authenticate the user for the request. If no token is
     * found, it will simply proceed without an authenticated user.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if an Authorization header with a Bearer token is present.
        if ($request->bearerToken()) {
            
            // Try to retrieve the user using the 'sanctum' guard.
            // This is the correct way to authenticate via a token.
            $user = Auth::guard('sanctum')->user();

            // If a valid user was found based on the token...
            if ($user) {
                // ...set this user as the currently authenticated user for the request.
                // THIS IS THE CRITICAL STEP that was missing. It makes the generic
                // Auth::check() and Auth::user() helpers work correctly in your controller.
                Auth::setUser($user);
            }
        }

        // Proceed with the request, whether a user was authenticated or not.
        return $next($request);
    }
}