<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SavedArticle;
use App\Models\Person;
use App\Models\Place;
use App\Models\Event;

class SavedArticleController extends Controller
{
    /**
     * Toggles the saved state of an article for the authenticated user.
     */
    public function toggleSave(Request $request)
    {
        $validated = $request->validate([
            'article_id' => 'required|integer',
            'article_type' => 'required|string|in:people,places,events',
        ]);

        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        }

        $existingSave = SavedArticle::where('user_id', $userId)
            ->where('article_id', $validated['article_id'])
            ->where('article_type', $validated['article_type'])
            ->first();

        if ($existingSave) {
            $existingSave->delete();
            return response()->json(['status' => 'success', 'action' => 'unsaved']);
        } else {
            SavedArticle::create([
                'user_id' => $userId,
                'article_id' => $validated['article_id'],
                'article_type' => $validated['article_type'],
            ]);
            return response()->json(['status' => 'success', 'action' => 'saved']);
        }
    }

    /**
     * Retrieves all saved articles for the authenticated user.
     */
    public function index()
    {
        $userId = Auth::id();
        $savedItems = SavedArticle::where('user_id', $userId)->latest()->get();

        $detailedArticles = $savedItems->map(function ($item) {
            $article = null;
            
            switch ($item->article_type) {
                case 'people':
                    $article = Person::find($item->article_id);
                    break;
                case 'places':
                    $article = Place::find($item->article_id);
                    break;
                case 'events':
                    $article = Event::find($item->article_id);
                    break;
            }

            if ($article) {
                return [
                    'article_id' => $article->id,
                    'article_type' => $item->article_type,
                    'title' => $article->name,
                    'image_url' => $article->picture ? asset('storage/' . $article->picture) : null,
                ];
            }
            return null;
        })->filter();

        return response()->json($detailedArticles);
    }
}