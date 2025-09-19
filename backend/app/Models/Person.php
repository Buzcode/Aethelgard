<?php

namespace App\Models;

use App\Models\Traits\Loggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class Person extends Model
{
    use HasFactory, Loggable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'bio',
        'birth_date',
        'death_date',
        'picture',
        'category',
        'likes',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['is_liked'];

    /**
     * The users that have liked this person.
     */
    public function likers(): BelongsToMany
    {
        // Assumes a pivot table named 'person_likes' with 'person_id' and 'user_id' columns
        return $this->belongsToMany(User::class, 'person_likes', 'person_id', 'user_id');
    }

    /**
     * Dynamically determines if the currently authenticated user has liked this person.
     * This attribute is appended to JSON responses.
     *
     * @return bool
     */
    public function getIsLikedAttribute()
    {
        // First, check if the value was already eager-loaded (performance optimization)
        if (array_key_exists('is_liked', $this->attributes)) {
            return (bool) $this->attributes['is_liked'];
        }

        // If no user is logged in, they can't have liked it
        if (!Auth::check()) {
            return false;
        }

        // Otherwise, query the database to check for a like relationship
        return $this->likers()->where('user_id', Auth::id())->exists();
    }

    /**
     * Get all of the person's saved article entries (polymorphic relationship).
     */
    public function saves(): MorphMany
    {
        return $this->morphMany(SavedArticle::class, 'article');
    }

    /**
     * Get the full URL for the person's picture.
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
}