<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pmb_fees', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->index()->constrained()->cascadeOnDelete();
            $table->unsignedInteger('amount');
            $table->string('notes', 255)->nullable();
            $table->boolean('is_active')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['school_id', 'academic_year_id'], 'pmb_fees_school_year_unique');
            $table->index(['school_id', 'is_active'], 'pmb_fees_school_active_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pmb_fees');
    }
};
