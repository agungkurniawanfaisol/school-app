<?php

namespace App\Console\Commands;

use Database\Seeders\Concerns\SeedsVirtualTourPanoramas;
use Illuminate\Console\Command;

class BakeVirtualTourSeedAssets extends Command
{
    use SeedsVirtualTourPanoramas;

    protected $signature = 'virtual-tour:bake-seed-assets {--force : Overwrite existing asset files}';

    protected $description = 'Download or generate 360° panorama files for VirtualTourSeeder assets';

    public function handle(): int
    {
        $dest = database_path('seeders/assets/virtual-tour');

        if (! is_dir($dest) && ! mkdir($dest, 0755, true) && ! is_dir($dest)) {
            $this->error('Cannot create assets directory.');

            return self::FAILURE;
        }

        foreach ($this->virtualTourPanoramaSources() as $source) {
            $path = $dest.'/'.$source['filename'];

            if (is_file($path) && ! $this->option('force')) {
                $this->line("Skip {$source['filename']} (exists)");

                continue;
            }

            $bytes = $this->resolvePanoramaBytes(
                $source['filename'],
                $source['scene_key'],
                $source['url'],
            );

            file_put_contents($path, $bytes);
            $this->info(sprintf('Wrote %s (%s KB)', $source['filename'], number_format(strlen($bytes) / 1024, 1)));
        }

        $this->comment('Run: php artisan db:seed --class=VirtualTourSeeder');

        return self::SUCCESS;
    }
}
