<?php

namespace App\Models;

use App\Models\Traits\Loggable; // <-- 1. IMPORT THE TRAIT
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;

class Place extends Model
{
    // 2. USE THE TRAIT
    use HasFactory, Loggable;

    protected $fillable = [
        'name', 'latitude', 'longitude', 'description', 'picture', 'category', 'likes'
    ];
    
    protected $appends = ['is_liked'];

    public function likers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'place_likes', 'place_id', 'user_id');
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