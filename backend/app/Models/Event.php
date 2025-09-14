<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function likers()
{
    return $this->belongsToMany(User::class, 'event_likes', 'event_id', 'user_id');
}
}