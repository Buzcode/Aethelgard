<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiAiService
{
    protected const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    /**
     * Generates a text response for a given prompt using a direct API call.
     */
    public function generateText(string $prompt): string
    {
        $apiKey = config('gemini.api_key');

        if (empty($apiKey)) {
            Log::error('Gemini API Key is not configured.');
            return 'Error: AI service is not configured correctly.';
        }

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])
        ->post(self::API_ENDPOINT . '?key=' . $apiKey, $payload);

        if ($response->failed()) {
            Log::error('Gemini API Error: ' . $response->body());
            return "Sorry, the AI service returned an error.";
        }

        $reply = $response->json('candidates.0.content.parts.0.text');

        if (is_null($reply)) {
            Log::warning('Gemini API returned no content. Response: ' . $response->body());
            return "Sorry, I couldn't generate a response for that prompt.";
        }

        return $reply;
    }
} 