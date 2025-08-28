<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiAiService
{
    protected const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    private const SYSTEM_PROMPT = "Aethelgard', a specialized AI assistant for the Aethelgard history website. Your SOLE purpose is to engage in conversations and answer questions strictly related to world history. This includes historical events, significant figures, civilizations, mythology, art history, and cultural evolution.\n\nYour Core Rules:\n1. Strictly Historical: You MUST ONLY discuss topics related to history.\n2. Politely Refuse Off-Topic Questions: If a user asks about anything non-historical (e.g., modern technology, science, math, coding, current events, personal opinions, or random chit-chat), you MUST politely refuse.\n3. Use the Specific Refusal Message: When you refuse, you must respond with this exact phrase: \"I am Aethelgard, a historical assistant. My purpose is to discuss the past, and I can only answer questions related to history. Could you please ask me something about a historical topic?\"\n4. Do Not Deviate: Do not get drawn into non-historical conversations, even if the user insists. Always steer the conversation back to history or use your refusal message.";

    public function generateContent(array $userHistory): string
    {
        $apiKey = config('gemini.api_key');
        if (empty($apiKey)) { /* ... error handling ... */ }

        $systemInstruction = [
            'role' => 'user',
            'parts' => [['text' => self::SYSTEM_PROMPT]]
        ];
        $modelPrimer = [
            'role' => 'model',
            'parts' => [['text' => 'Understood. I will act as Aethelgard and only discuss historical topics.']]
        ];

        $userContents = array_map(function ($message) {
            return [
                'role' => $message['role'],
                'parts' => [['text' => $message['content']]]
            ];
        }, $userHistory);

        $contents = array_merge([$systemInstruction, $modelPrimer], $userContents);

        $payload = ['contents' => $contents];
        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->post(self::API_ENDPOINT . '?key=' . $apiKey, $payload);

        if ($response->failed()) {
            Log::error('Gemini API Error: ' . $response->body());
            return "Sorry, the AI service returned an error.";
        }
        
        $reply = $response->json('candidates.0.content.parts.0.text');

        return $reply ?? "Sorry, I couldn't generate a response for that prompt.";
    }
}