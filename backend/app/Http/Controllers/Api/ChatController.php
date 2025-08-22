<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OpenAIService; // Import our service
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    protected $openAIService;

    // Use dependency injection to get an instance of our service
    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    /**
     * Handle an incoming chat request.
     */
    public function chat(Request $request)
    {
        // 1. Validate the incoming request
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:4096',
            // We will add a 'persona_id' later
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userMessage = $request->input('message');

        // 2. (For now) Just return a dummy response to prove it works
        // In the next step, we will replace this with a real call
        // to $this->openAIService->getCompletion(...)
        
        $dummyResponse = "This is a dummy response. The controller received your message: '{$userMessage}'";

        return response()->json([
            'reply' => $dummyResponse
        ]);
    }
}