<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('label', 20);
            $table->boolean('is_active')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['school_id', 'label'], 'academic_years_school_label_unique');
            $table->index(['school_id', 'is_active'], 'academic_years_school_active_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_years');
    }
};
