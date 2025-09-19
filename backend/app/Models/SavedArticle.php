<?php
// in app/Models/SavedArticle.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo; // <-- 1. IMPORT THIS

class SavedArticle extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * This array tells Laravel that it's safe to fill these columns
     * using the Model::create() method. This is the fix for your error.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'article_id',
        'article_type',
    ];

        public function article(): MorphTo // <-- 2. ADD THIS ENTIRE METHOD
    {
        return $this->morphTo();
    }
}