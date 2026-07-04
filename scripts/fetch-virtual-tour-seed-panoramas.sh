#!/usr/bin/env bash
# Download equirectangular 360° panoramas into database/seeders/assets/virtual-tour/
# Run when online: ./scripts/fetch-virtual-tour-seed-panoramas.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/backend/database/seeders/assets/virtual-tour"
mkdir -p "$DEST"

declare -A URLS=(
  ["gerbang-utama.jpg"]="https://pannellum.org/images/alma.jpg"
  ["ruang-kelas.jpg"]="https://pannellum.org/images/cerro-toco-0.jpg"
  ["perpustakaan.jpg"]="https://pannellum.org/images/cerro-toco-1.jpg"
)

for file in "${!URLS[@]}"; do
  url="${URLS[$file]}"
  echo "Downloading $file ..."
  curl -fsSL --max-time 120 -o "$DEST/$file" "$url"
  echo "  -> $(du -h "$DEST/$file" | awk '{print $1}')"
done

echo "Done. Assets saved to $DEST"
