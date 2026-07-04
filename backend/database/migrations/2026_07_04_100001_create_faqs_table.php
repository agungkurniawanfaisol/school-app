<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('question', 500);
            $table->text('answer');
            $table->enum('category', ['pmb', 'akademik', 'biaya', 'umum'])->default('umum');
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'faqs_school_active_order_idx');
            $table->index(['category', 'is_active'], 'faqs_category_active_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
