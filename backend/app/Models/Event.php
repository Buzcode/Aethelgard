<?php

namespace App\Models;

use App\Models\Traits\Loggable; // <-- 1. IMPORT THE TRAIT
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;

class Event extends Model
{
    // 2. USE THE TRAIT (this automatically adds the searchLogs() method)
    use HasFactory, Loggable;

    protected $fillable = [
        'name', 'description', 'event_date', 'picture', 'category', 'likes'
    ];
    
    protected $appends = ['is_liked'];

    public function likers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_likes', 'event_id', 'user_id');
    }

    /*
     * The searchLogs() method has been removed from here
     * because it is now provided by the Loggable trait.
     */

    public function getIsLikedAttribute()
    {
        if (array_key_exists('is_liked', $this->attributes)) {
            return (bool) $this->attributes['is_liked'];
        }
        if (!Auth::check()) {
            return false;
        }
        return $this->likers()->where('user_id', Auth::id())->exists();
    }
}