<?php

namespace App\Models\Traits;

use App\Models\SearchLog;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Loggable
{
    /**
     * Get all of the model's search logs.
     */
    public function searchLogs(): MorphMany
    {
        // This defines the polymorphic relationship to the SearchLog model.
        // It tells Laravel that this model (Person, Place, or Event)
        // can have many SearchLog entries associated with it.
        return $this->morphMany(SearchLog::class, 'loggable');
    }
}