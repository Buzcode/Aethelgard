<?php
// in app/Models/SavedArticle.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}