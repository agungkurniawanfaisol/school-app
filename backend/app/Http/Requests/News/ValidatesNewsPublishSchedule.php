<?php

namespace App\Http\Requests\News;

use App\Http\Requests\AdminFormRequest;
use Illuminate\Validation\Validator;

trait ValidatesNewsPublishSchedule
{
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $starts = $this->input('published_at');
            $ends = $this->input('publish_ends_at');

            if ($starts === null || $ends === null) {
                return;
            }

            if (strtotime((string) $ends) <= strtotime((string) $starts)) {
                $validator->errors()->add(
                    'publish_ends_at',
                    'Waktu berakhir harus setelah waktu mulai.',
                );
            }
        });
    }
}
