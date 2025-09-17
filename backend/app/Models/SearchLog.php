<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SearchLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'search_term',
        'loggable_id',
        'loggable_type',
    ];

    /**
     * Get the parent loggable model (this can be a Person, Place, or Event).
     */
    public function loggable(): MorphTo
    {
        return $this->morphTo();
    }
}