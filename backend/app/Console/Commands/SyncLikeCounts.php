<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Person;
use App\Models\Event;
use App\Models\Place;

class SyncLikeCounts extends Command
{
    protected $signature = 'app:sync-like-counts';
    protected $description = 'Synchronize the likes_count for all models using direct DB queries.';

    public function handle()
    {
        $this->info('Syncing like counts for People...');
        Person::all()->each(function ($person) {
            $count = DB::table('person_likes')->where('person_id', $person->id)->count();
            
            // --- THE DEFINITIVE FIX ---
            // Bypass the Eloquent save() method and update the database directly.
            DB::table('people')->where('id', $person->id)->update(['likes_count' => $count]);

            $this->line("  - Person '{$person->name}': Synced count to {$count}");
        });

        $this->info('Syncing like counts for Events...');
        Event::all()->each(function ($event) {
            $count = DB::table('event_likes')->where('event_id', $event->id)->count();
            $event->likes_count = $count;
            $event->save();
            $this->line("  - Event '{$event->name}': Synced count to {$count}");
        });

        $this->info('Syncing like counts for Places...');
        Place::all()->each(function ($place) {
            $count = DB::table('place_likes')->where('place_id', $place->id)->count();
            $place->likes_count = $count;
            $place->save();
            $this->line("  - Place '{$place->name}': Synced count to {$count}");
        });

        $this->info('All like counts have been synchronized successfully!');
        return 0;
    }
}