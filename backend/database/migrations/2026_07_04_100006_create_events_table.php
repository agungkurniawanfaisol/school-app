<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->string('location', 200)->nullable();
            $table->date('event_date');
            $table->date('event_end_date')->nullable();
            $table->string('event_time', 20)->nullable();
            $table->enum('category', ['akademik', 'keagamaan', 'olahraga', 'umum'])->default('umum');
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'event_date'], 'events_school_active_date_idx');
            $table->index(['category', 'is_active'], 'events_category_active_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
