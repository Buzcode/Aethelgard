<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth; // <-- Import Auth facade

class Place extends Model
{
    use HasFactory;

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
     * The accessors to append to the model's array form.
     * This tells Laravel to always include 'is_liked' when sending this model as JSON.
     *
     * @var array
     */
    protected $appends = ['is_liked']; // <-- ADD THIS

    /**
     * The users that have liked this place.
     */
    public function likers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'place_likes', 'place_id', 'user_id');
    }

    /**
     * Accessor to calculate the 'is_liked' attribute.
     * Laravel automatically calls this method when it needs the value for 'is_liked'.
     *
     * @return bool
     */
    // v-- ADD THIS ENTIRE METHOD --v
    public function getIsLikedAttribute()
    {
        // If 'is_liked' was already loaded by an efficient 'withExists' query, return that value.
        if (array_key_exists('is_liked', $this->attributes)) {
            return (bool) $this->attributes['is_liked'];
        }

        // If no user is logged in, they can't have liked it.
        if (!Auth::check()) {
            return false;
        }

        // Check if the authenticated user's ID exists in the 'likers' relationship for this place.
        return $this->likers()->where('user_id', Auth::id())->exists();
    }
}