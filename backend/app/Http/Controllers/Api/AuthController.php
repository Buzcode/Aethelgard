<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**   
     * Handle user registration.
     */
    public function register(Request $request)
    {
        // 1. Validate the incoming data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);
    

        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Create the new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // The 'role' will use the 'user' default we set in the migration
        ]);

        // 3. Return a success response
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201); // 201 means "Created"
    }
        /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        // 1. Validate the incoming data
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);
 
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Attempt to authenticate the user
        if (!auth()->attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401); // 401 means "Unauthorized"
        }

        // 3. Get the authenticated user
        $user = User::where('email', $request->email)->first();

        // 4. Create and return the API token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]); 
    } 
        /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        // Get the current user's token and delete it
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}  