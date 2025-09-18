<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
// --- MODIFIED: The 'Like' model has been removed as it doesn't exist ---
use App\Models\SavedArticle;
use App\Models\Person;
use App\Models\Place;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use App\Models\UserRecommendation;

class GenerateUserRecommendations extends Command
{
    protected $signature = 'recommendations:generate';
    protected $description = 'Generate weekly article recommendations for all users';

    public function handle()
    {
        $this->info('Starting recommendation generation...');

        $users = User::all();

        foreach ($users as $user) {
            // 1. Clear out old recommendations for the user
            DB::table('user_recommendations')->where('user_id', $user->id)->delete();

            // 2. Tally up sub-category interactions
            $subCategoryCounts = [];
            $interactedArticleIds = ['person' => [], 'place' => [], 'event' => []];

            // --- START OF MODIFICATIONS ---

            // Process Likes by using the relationships on the User model
            $likedItems = $user->likedPeople->concat($user->likedPlaces)->concat($user->likedEvents);

            foreach ($likedItems as $item) {
                if ($item && $item->category) {
                    $subCategoryName = $item->category;
                    $subCategoryCounts[$subCategoryName] = ($subCategoryCounts[$subCategoryName] ?? 0) + 1;
                }
            }

            // Process Saves (this logic was already correct)
            $saves = SavedArticle::where('user_id', $user->id)->get();
            foreach ($saves as $save) {
                $article = null;
                if ($save->article_type === 'people') {
                     $article = Person::find($save->article_id);
                     $interactedArticleIds['person'][] = $save->article_id;
                } elseif ($save->article_type === 'places') {
                     $article = Place::find($save->article_id);
                     $interactedArticleIds['place'][] = $save->article_id;
                } elseif ($save->article_type === 'events') {
                     $article = Event::find($save->article_id);
                     $interactedArticleIds['event'][] = $save->article_id;
                }

                if ($article && $article->category) {
                    $subCategoryName = $article->category;
                    $subCategoryCounts[$subCategoryName] = ($subCategoryCounts[$subCategoryName] ?? 0) + 1;
                }
            }
            
            // --- END OF MODIFICATIONS ---

            // 3. Find the top sub-category
            if (empty($subCategoryCounts)) {
                continue; // Skip user if they have no interactions
            }
            arsort($subCategoryCounts);
            $topSubCategoryName = key($subCategoryCounts);

            // 4. Find new articles from that sub-category (this logic was already correct)
            $peopleRecs = Person::where('category', $topSubCategoryName)
                ->whereNotIn('id', $interactedArticleIds['person'])
                ->inRandomOrder()->limit(5)->get();

            $placesRecs = Place::where('category', $topSubCategoryName)
                ->whereNotIn('id', $interactedArticleIds['place'])
                ->inRandomOrder()->limit(5)->get();

            $eventsRecs = Event::where('category', $topSubCategoryName)
                ->whereNotIn('id', $interactedArticleIds['event'])
                ->inRandomOrder()->limit(5)->get();
            
            $recommendations = $peopleRecs->concat($placesRecs)->concat($eventsRecs)->shuffle();
            $finalRecommendations = $recommendations->take(5);

            // 5. Save the new recommendations to the database
            foreach ($finalRecommendations as $rec) {
                UserRecommendation::create([
                    'user_id' => $user->id,
                    'recommendable_id' => $rec->id,
                    'recommendable_type' => get_class($rec),
                    'reason' => 'Top Sub-Category: ' . $topSubCategoryName,
                ]);
            }
        }

        $this->info('Successfully generated recommendations for ' . $users->count() . ' users.');
        return 0;
    }
}