<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlbumPhoto extends Model
{
    protected $fillable = [
        'photo_album_id',
        'url',
        'caption',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    public function album(): BelongsTo
    {
        return $this->belongsTo(PhotoAlbum::class, 'photo_album_id');
    }
}
