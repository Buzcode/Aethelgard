<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Added for consistency
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // Added for type-hinting

class Place extends Model
{
    use HasFactory; // Added for consistency

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'description',
        'picture',
        'category',
        'likes'
    ];

    /**
     * The users that have liked this place.
     */
    public function likers(): BelongsToMany
    {
        // --- CORRECTED HERE ---
        // The relationship must use the 'place_likes' table and the 'place_id' foreign key.
        return $this->belongsToMany(User::class, 'place_likes', 'place_id', 'user_id');
    }
}