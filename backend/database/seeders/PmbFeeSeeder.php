<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\PmbFee;
use App\Models\School;
use App\Models\Setting;
use App\Support\Rupiah;
use Illuminate\Database\Seeder;

class PmbFeeSeeder extends Seeder
{
    public function run(): void
    {
        $schools = School::query()->where('is_active', true)->orderBy('id')->get();

        foreach ($schools as $school) {
            $activeYear = AcademicYear::query()
                ->where('school_id', $school->id)
                ->where('is_active', true)
                ->orderByDesc('id')
                ->first()
                ?? AcademicYear::query()
                    ->where('school_id', $school->id)
                    ->orderByDesc('id')
                    ->first();

            if ($activeYear === null) {
                continue;
            }

            $settingValue = Setting::query()
                ->where('school_id', $school->id)
                ->where('group', 'pmb')
                ->where('key', 'pmb_fee')
                ->value('value');

            $amount = Rupiah::parse(is_string($settingValue) ? $settingValue : null) ?? 350000;

            $previousYear = AcademicYear::query()
                ->where('school_id', $school->id)
                ->where('label', '!=', $activeYear->label)
                ->orderByDesc('id')
                ->first();

            if ($previousYear !== null) {
                PmbFee::query()->updateOrCreate(
                    [
                        'school_id' => $school->id,
                        'academic_year_id' => $previousYear->id,
                    ],
                    [
                        'amount' => max(1000, $amount - 50000),
                        'notes' => 'Biaya tahun ajaran sebelumnya',
                        'is_active' => false,
                    ],
                );
            }

            PmbFee::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'academic_year_id' => $activeYear->id,
                ],
                [
                    'amount' => $amount,
                    'notes' => 'Biaya pendaftaran aktif',
                    'is_active' => true,
                ],
            );

            Setting::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'group' => 'pmb',
                    'key' => 'pmb_fee',
                ],
                [
                    'value' => Rupiah::format($amount),
                    'type' => 'string',
                ],
            );
        }
    }
}
