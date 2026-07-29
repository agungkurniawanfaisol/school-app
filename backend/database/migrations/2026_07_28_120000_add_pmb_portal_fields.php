<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
            $table->foreignId('user_id')->nullable()->after('school_id')->index()->constrained()->nullOnDelete();
            $table->json('draft_payload')->nullable()->after('payment_info');
            $table->unsignedTinyInteger('current_step')->default(1)->after('draft_payload');
            $table->timestamp('loa_issued_at')->nullable()->after('current_step');
            $table->unsignedBigInteger('loa_media_id')->nullable()->after('loa_issued_at');
        });

        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->string('student_name', 200)->nullable()->change();
        });

        DB::table('pmb_registrations')->orderBy('id')->chunkById(100, function ($rows): void {
            foreach ($rows as $row) {
                $status = $row->status === 'pending' ? 'submitted' : $row->status;

                DB::table('pmb_registrations')->where('id', $row->id)->update([
                    'uuid' => (string) Str::uuid(),
                    'status' => $status,
                ]);
            }
        });

        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->unique('uuid');
        });

        Schema::create('pmb_registration_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pmb_registration_id')->index()->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->index()->constrained()->cascadeOnDelete();
            $table->text('body');
            $table->unsignedBigInteger('media_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['pmb_registration_id', 'created_at'], 'pmb_msg_reg_created_idx');
        });

        Schema::create('pmb_registration_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pmb_registration_id')->index()->constrained()->cascadeOnDelete();
            $table->foreignId('actor_user_id')->nullable()->index()->constrained('users')->nullOnDelete();
            $table->string('type', 50)->index();
            $table->string('message', 500)->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['pmb_registration_id', 'created_at'], 'pmb_evt_reg_created_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pmb_registration_events');
        Schema::dropIfExists('pmb_registration_messages');

        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->dropUnique(['uuid']);
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['uuid', 'draft_payload', 'current_step', 'loa_issued_at', 'loa_media_id']);
        });

        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->string('student_name', 200)->nullable(false)->change();
        });
    }
};
