<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pmb_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('registration_number', 50)->unique();
            $table->string('tracking_token', 64)->unique();
            $table->string('student_name', 200);
            $table->string('birth_place', 100)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('gender', 10)->nullable();
            $table->string('parent_name', 200)->nullable();
            $table->string('parent_phone', 30)->nullable();
            $table->string('parent_email', 150)->nullable();
            $table->text('address')->nullable();
            $table->string('previous_school', 250)->nullable();
            $table->string('grade_applied', 50)->nullable()->index();
            $table->string('status', 20)->default('pending')->index();
            $table->text('notes')->nullable();
            $table->json('payment_info')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'status'], 'pmb_school_status_idx');
            $table->index(['status', 'created_at'], 'pmb_status_created_idx');
        });

        Schema::create('pmb_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pmb_registration_id')->index()->constrained()->cascadeOnDelete();
            $table->string('document_type', 50)->index();
            $table->string('file_path', 500);
            $table->string('original_name', 250)->nullable();
            $table->string('status', 20)->default('pending')->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['pmb_registration_id', 'document_type'], 'pmb_docs_reg_type_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pmb_documents');
        Schema::dropIfExists('pmb_registrations');
    }
};
