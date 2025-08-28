<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\GeminiAiService; // Import the service we created

class ChatController extends Controller
{
    /**
     * This method handles the incoming API request.
     */
    public function handleChat(Request $request, GeminiAiService $gemini)
    {
        // 1. Validate the input to make sure a 'prompt' was sent
        $validated = $request->validate([
            'prompt' => 'required|string|max:2000'
        ]);

        // 2. Call our service's generateText method with the user's prompt
        $response = $gemini->generateText($validated['prompt']);

        // 3. Return the AI's reply as a JSON response
        return response()->json([
            'reply' => $response
        ]);
    }
}