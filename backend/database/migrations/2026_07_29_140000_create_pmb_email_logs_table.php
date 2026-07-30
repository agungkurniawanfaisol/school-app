<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pmb_email_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('pmb_registration_id')->index()->constrained()->cascadeOnDelete();
            $table->string('type', 30);
            $table->string('recipient_email', 150)->nullable();
            $table->string('subject', 200);
            $table->text('body')->nullable();
            $table->string('status', 20)->default('queued');
            $table->string('error_message', 500)->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['pmb_registration_id', 'type', 'status'], 'pmb_email_logs_reg_type_status_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pmb_email_logs');
    }
};
