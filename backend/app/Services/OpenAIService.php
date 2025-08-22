<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;
use Exception;

class OpenAIService
{
    /**
     * Sends a chat prompt to the OpenAI API and returns the response.
     *
     * @param array $messages The array of messages for the chat conversation.
     * @return string|null The content of the AI's response, or null on failure.
     */
    public function getChatCompletion(array $messages): ?string
    {
        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo', // A cost-effective and capable model to start
                'messages' => $messages,
            ]);

            // Return the content of the first choice's message
            return $response->choices[0]->message->content;

        } catch (Exception $e) {
            // Log the error for debugging purposes
            Log::error('OpenAI API Error: ' . $e->getMessage());
            
            // Return null to indicate failure
            return null;
        }
    }
}