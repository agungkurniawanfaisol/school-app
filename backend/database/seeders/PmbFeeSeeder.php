<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\PmbFee;
use App\Models\PmbProgram;
use App\Models\School;
use Illuminate\Database\Seeder;

class PmbFeeSeeder extends Seeder
{
    public function run(): void
    {
        $schools = School::query()->where('is_active', true)->orderBy('id')->get();

        $catalog = [
            ['name' => 'TK Reguler', 'jenjang' => PmbFee::JENJANG_TK, 'program' => PmbFee::PROGRAM_REGULER, 'amount' => 250000],
            ['name' => 'TK ICP', 'jenjang' => PmbFee::JENJANG_TK, 'program' => PmbFee::PROGRAM_ICP, 'amount' => 350000],
            ['name' => 'SD Reguler', 'jenjang' => PmbFee::JENJANG_SD, 'program' => PmbFee::PROGRAM_REGULER, 'amount' => 350000],
            ['name' => 'SD ICP', 'jenjang' => PmbFee::JENJANG_SD, 'program' => PmbFee::PROGRAM_ICP, 'amount' => 450000],
        ];

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

            $reguler = PmbProgram::query()->firstOrCreate(
                ['school_id' => $school->id, 'code' => 'reguler'],
                ['name' => 'Reguler', 'sort_order' => 10, 'is_active' => true],
            );
            $icp = PmbProgram::query()->firstOrCreate(
                ['school_id' => $school->id, 'code' => 'icp'],
                ['name' => 'ICP', 'sort_order' => 20, 'is_active' => true],
            );

            foreach ($catalog as $item) {
                $program = $item['program'] === PmbFee::PROGRAM_ICP ? $icp : $reguler;

                PmbFee::query()->updateOrCreate(
                    [
                        'school_id' => $school->id,
                        'academic_year_id' => $activeYear->id,
                        'jenjang' => $item['jenjang'],
                        'pmb_program_id' => $program->id,
                    ],
                    [
                        'name' => $item['name'],
                        'program' => $item['program'],
                        'amount' => $item['amount'],
                        'bank_name' => 'Bank Syariah Indonesia (BSI)',
                        'account_number' => '1234567890',
                        'account_holder' => 'Yayasan Nurul Hikmah',
                        'notes' => 'Biaya pendaftaran '.$item['name'],
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
