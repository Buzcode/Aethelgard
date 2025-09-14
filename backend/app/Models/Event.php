<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'event_date',
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
    protected $appends = ['is_liked'];

    /**
     * The relationship to the users who have liked this event.
     * This is the source of truth for all "like" data.
     */
    public function likers()
    {
        return $this->belongsToMany(User::class, 'event_likes', 'event_id', 'user_id');
    }

    /**
     * Accessor to calculate the 'is_liked' attribute.
     *
     * Laravel automatically calls this method when it needs the value for 'is_liked'.
     * This is especially useful for the show(), store(), and update() controller methods.
     *
     * @return bool
     */
    public function getIsLikedAttribute()
    {
        // If the 'is_liked' attribute was already loaded by an efficient 'withExists' query
        // in the controller, just return that value.
        if (array_key_exists('is_liked', $this->attributes)) {
            return (bool) $this->attributes['is_liked'];
        }

        // Otherwise, calculate it. If no user is logged in, they can't have liked it.
        if (!Auth::check()) {
            return false;
        }

        // Check if the authenticated user's ID exists in the 'likers' relationship for THIS event.
        return $this->likers()->where('user_id', Auth::id())->exists();
    }
}