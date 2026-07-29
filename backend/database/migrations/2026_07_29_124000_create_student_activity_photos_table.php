<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_activity_photos', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('student_activity_id')->index()->constrained()->cascadeOnDelete();
            $table->string('path', 500);
            $table->string('caption', 250)->nullable();
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(
                ['student_activity_id', 'is_active', 'order'],
                'activity_photos_activity_active_order_idx',
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_activity_photos');
    }
};
