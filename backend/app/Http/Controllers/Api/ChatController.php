<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\GeminiAiService;

class ChatController extends Controller
{
    public function handleChat(Request $request, GeminiAiService $gemini)
    {
        $validated = $request->validate([
            'history' => 'sometimes|array', // History can be empty on the first message
            'history.*.role' => 'required|string|in:user,model',
            'history.*.content' => 'required|string',
        ]);
        
        $userHistory = $validated['history'] ?? [];

        // The service will now return the AI's reply
        $aiReply = $gemini->generateContent($userHistory);
        
        // We add the AI's reply to the history
        $userHistory[] = ['role' => 'model', 'content' => $aiReply];

        // Return the complete, updated history
        return response()->json([
            'history' => $userHistory
        ]);
    }
}