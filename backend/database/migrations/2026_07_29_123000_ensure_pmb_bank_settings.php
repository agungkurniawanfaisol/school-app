<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ensure PMB transfer destination settings exist so admin can fill them
     * and the register wizard can show Bank / No. Rekening / Atas nama.
     */
    public function up(): void
    {
        if (! Schema::hasTable('settings') || ! Schema::hasTable('schools')) {
            return;
        }

        $now = now();
        $keys = [
            'pmb_bank_name' => '',
            'pmb_account_number' => '',
            'pmb_account_holder' => '',
        ];

        $schoolIds = DB::table('schools')->whereNull('deleted_at')->pluck('id');

        foreach ($schoolIds as $schoolId) {
            foreach ($keys as $key => $defaultValue) {
                $exists = DB::table('settings')
                    ->where('school_id', $schoolId)
                    ->where('group', 'pmb')
                    ->where('key', $key)
                    ->whereNull('deleted_at')
                    ->exists();

                if ($exists) {
                    continue;
                }

                DB::table('settings')->insert([
                    'school_id' => $schoolId,
                    'group' => 'pmb',
                    'key' => $key,
                    'value' => $defaultValue,
                    'type' => 'string',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        // Keep rows — removing them would hide bank details again.
    }
};
