<?php

namespace App\Models;

use App\Models\Traits\Loggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class Place extends Model
{
    use HasFactory, Loggable;

    protected $fillable = [
        'name', 'latitude', 'longitude', 'description', 'picture', 'category', 'likes'
    ];
    
    protected $appends = ['is_liked'];

    public function likers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'place_likes', 'place_id', 'user_id');
    }

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

    public function saves(): MorphMany
    {
        return $this->morphMany(SavedArticle::class, 'article');
    }

    // vvv ADD THIS METHOD vvv
    /**
     * Get the full URL for the place's picture.
     * This is an accessor that automatically converts the stored
     * relative path into a full, publicly accessible URL.
     *
     * @param  string|null  $value The raw value from the 'picture' column.
     * @return string|null
     */
    public function getPictureAttribute($value)
    {
        // If a picture path exists in the database, create a full URL to it.
        // Otherwise, return null.
        return $value ? Storage::disk('public')->url($value) : null;
    }
    // ^^^ ADD THIS METHOD ^^^
}