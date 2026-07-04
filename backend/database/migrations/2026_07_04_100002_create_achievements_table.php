<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->enum('category', ['akademik', 'olahraga', 'seni', 'keagamaan', 'lainnya'])->default('akademik');
            $table->enum('level', ['sekolah', 'kecamatan', 'kota', 'provinsi', 'nasional', 'internasional'])->default('sekolah');
            $table->string('student_name', 200)->nullable();
            $table->smallInteger('year')->unsigned();
            $table->string('image', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'achievements_school_active_order_idx');
            $table->index(['category', 'is_active'], 'achievements_category_active_idx');
            $table->index(['year'], 'achievements_year_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
