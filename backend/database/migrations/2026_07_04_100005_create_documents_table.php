<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->enum('category', ['brosur', 'formulir', 'peraturan', 'kalender', 'lainnya'])->default('lainnya');
            $table->string('file_url', 500);
            $table->unsignedInteger('file_size')->nullable();
            $table->string('file_type', 50)->nullable();
            $table->unsignedInteger('download_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'documents_school_active_order_idx');
            $table->index(['category', 'is_active'], 'documents_category_active_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
