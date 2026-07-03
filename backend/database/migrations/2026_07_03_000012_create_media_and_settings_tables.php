<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->index()->constrained()->nullOnDelete();
            $table->string('filename', 250);
            $table->string('original_name', 250);
            $table->string('path', 500);
            $table->string('disk', 20)->default('public');
            $table->string('mime_type', 100)->nullable()->index();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('collection', 50)->nullable()->index();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['collection', 'created_at'], 'media_collection_created_idx');
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->nullable()->index()->constrained()->cascadeOnDelete();
            $table->string('group', 50)->default('general')->index();
            $table->string('key', 100);
            $table->text('value')->nullable();
            $table->string('type', 20)->default('string');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['school_id', 'group', 'key'], 'settings_school_group_key_unique');
            $table->index(['group', 'key'], 'settings_group_key_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('media');
    }
};
