<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_values', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('icon', 100)->nullable();
            $table->string('title', 100);
            $table->string('description', 500);
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'school_values_school_active_order_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_values');
    }
};
