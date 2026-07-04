<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('extracurriculars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->enum('category', ['olahraga', 'seni', 'akademik', 'keagamaan', 'lainnya'])->default('lainnya');
            $table->string('schedule', 200)->nullable();
            $table->string('instructor', 200)->nullable();
            $table->string('image', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'extracurriculars_school_active_order_idx');
            $table->index(['category', 'is_active'], 'extracurriculars_category_active_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('extracurriculars');
    }
};
