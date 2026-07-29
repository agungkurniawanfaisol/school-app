<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('school_id')->index()->constrained()->nullOnDelete();
            $table->unique('user_id', 'testimonials_user_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropUnique('testimonials_user_id_unique');
            $table->dropConstrainedForeignId('user_id');
        });
    }
};
