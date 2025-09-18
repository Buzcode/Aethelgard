<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GeminiAiService
{
    protected const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    private const UNIFIED_SYSTEM_PROMPT = <<<PROMPT
    You are a specialized AI assistant for a history website. You operate in one of two modes.

    **Mode 1: Default Historian Persona ('Aethelgard')**
    - Your name is Aethelgard.
    - Your SOLE purpose is to answer questions strictly related to world history (events, figures, civilizations, art, etc.).
    - If a user asks about anything non-historical, you MUST respond with this exact phrase: "I am Aethelgard, a historical assistant. My purpose is to discuss the past, and I can only answer questions related to history. Could you please ask me something about a historical topic?"

    **Mode 2: Historical Figure Impersonation**
    - **TRIGGER:** If the user's LATEST message is clearly asking about a specific, named historical figure (e.g., "Tell me about Cleopatra," "Who was Winston Churchill?"), you MUST switch to this mode for your response.
    - **RULES FOR IMPERSONATION:**
        1. You ARE that historical figure. You must respond in the first person ('I', 'me', 'my').
        2. Start by clearly acknowledging your identity as that person.
        3. First, provide the core, informative, historical facts to answer the user's query.
        4. AFTER providing the facts, you may add 1-2 sentences of personal reflection from your persona's point of view.
        5. Stay in character. Do not reveal you are an AI. If asked about events after your death, state that you are unaware of them as they happened after your time.

    You will decide which mode to use based on the user's most recent question.
    PROMPT;

    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('gemini.api_key');
        if (empty($this->apiKey)) {
            throw new Exception('Gemini API Key is not configured.');
        }
    }

    public function generateContent(array $userHistory, ?array $currentPersona): array
    {
        try {
            if ($currentPersona && $currentPersona['type'] === 'figure') {
                $systemPrompt = $this->createFigurePrompt($currentPersona['name']);
                $activePersona = $currentPersona;
            } else {
                $systemPrompt = self::UNIFIED_SYSTEM_PROMPT;
                $activePersona = ['type' => 'historian'];
            }

            $aiReplyText = $this->generateResponse($userHistory, $systemPrompt);

            $newPersonaName = $this->parsePersonaFromResponse($aiReplyText);
            if ($newPersonaName) {
                 $activePersona = ['type' => 'figure', 'name' => $newPersonaName];
            }

            $userHistory[] = ['role' => 'model', 'content' => $aiReplyText];

            return [
                'history' => $userHistory,
                'persona' => $activePersona,
            ];

        } catch (Exception $e) {
            Log::error('AI Generation Failed: ' . $e->getMessage());
            $userHistory[] = ['role' => 'model', 'content' => 'Sorry, a critical error occurred while preparing my response.'];
            return ['history' => $userHistory, 'persona' => $currentPersona];
        }
    }

    private function parsePersonaFromResponse(string $text): ?string
    {
        if (preg_match('/^I, ([\w\s\'.-]{1,40}),/i', $text, $matches)) {
            return trim($matches[1]);
        }
        return null;
    }

    /**
     * Creates the structured system prompt for an already-active historical figure persona.

     */
    private function createFigurePrompt(string $personName): string
    {
        return "You ARE {$personName}. You are continuing a conversation. Your entire response must be from this first-person perspective ('I', 'me', 'my').

        **Core Rules for this turn:**
        1.  **DO NOT Re-introduce Yourself:** The user already knows who you are. Jump directly into answering their question. Do NOT start with 'I am {$personName}'.
        2.  **Be a Knowledgeable Guide:** You are an expert on your own life and the historical context of your time. You can answer questions about yourself OR about other historical events and people from your unique perspective.
        3.  **Handle Post-Mortem Events Gracefully:** If asked about a person or event that occurred after your death (e.g., Albert Einstein for Napoleon), you MUST respond by politely stating you are not familiar with them as they lived after your time. Example response: 'I am not familiar with Mr. Einstein; he must have lived long after my time on Earth.'
        4.  **Answer Broad Questions:** If asked a general historical question you would have knowledge of (e.g., Cleopatra on 'Roman Rulers'), answer it informatively from your perspective.
        5.  **Maintain Character:** Always stay in character. Do not reveal you are an AI.
        ";
    }

    private function generateResponse(array $userHistory, string $systemPrompt): string
    {
        $systemInstruction = ['role' => 'user', 'parts' => [['text' => $systemPrompt]]];
        $modelPrimer = ['role' => 'model', 'parts' => [['text' => 'Understood. I will follow my instructions.']]];
        
        $userContents = array_map(function ($message) {
            return ['role' => $message['role'], 'parts' => [['text' => $message['content']]]];
        }, $userHistory);

        $contents = array_merge([$systemInstruction, $modelPrimer], $userContents);
        $payload = ['contents' => $contents];

        return $this->makeApiCall($payload);
    }
    
    private function makeApiCall(array $payload): string
    {
        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->post(self::API_ENDPOINT . '?key=' . $this->apiKey, $payload);

        if ($response->failed()) {
            Log::error('Gemini API Error: ' . $response->body());
            throw new Exception('API request failed. Status: ' . $response->status() . ' Body: ' . $response->body());
        }

        $reply = $response->json('candidates.0.content.parts.0.text');

        if (empty($reply)) {
            Log::warning('Gemini API returned an empty or blocked response.', ['response' => $response->json()]);
            return "My response was blocked or could not be generated. Please rephrase your question.";
        }
        
        return $reply;
    }
}