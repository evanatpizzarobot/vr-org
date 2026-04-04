#!/bin/bash
# Generate favicon.ico and apple-touch-icon.png from logo.png
# Requires ImageMagick (magick or convert command)
#
# Usage: bash scripts/generate-favicons.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PUBLIC="$PROJECT_DIR/public"
LOGO="$PUBLIC/logo.png"

if ! command -v magick &>/dev/null && ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick not found. Install it first:"
  echo "  Windows: winget install ImageMagick.ImageMagick"
  echo "  macOS:   brew install imagemagick"
  echo "  Linux:   sudo apt install imagemagick"
  exit 1
fi

# Use 'magick' (v7) or fall back to 'convert' (v6)
CMD="magick"
command -v magick &>/dev/null || CMD="convert"

echo "Generating favicon.ico (16x16, 32x32, 48x48)..."
$CMD "$LOGO" -background none -gravity center \
  \( -clone 0 -resize 16x16 -extent 16x16 \) \
  \( -clone 0 -resize 32x32 -extent 32x32 \) \
  \( -clone 0 -resize 48x48 -extent 48x48 \) \
  -delete 0 \
  "$PUBLIC/favicon.ico"

echo "Generating apple-touch-icon.png (180x180)..."
$CMD "$LOGO" -background "#0E1117" -gravity center \
  -resize 160x160 -extent 180x180 \
  "$PUBLIC/apple-touch-icon.png"

echo "Generating favicon-32x32.png..."
$CMD "$LOGO" -background none -gravity center \
  -resize 32x32 -extent 32x32 \
  "$PUBLIC/favicon-32x32.png"

echo "Generating favicon-16x16.png..."
$CMD "$LOGO" -background none -gravity center \
  -resize 16x16 -extent 16x16 \
  "$PUBLIC/favicon-16x16.png"

echo "Done! Favicons saved to $PUBLIC/"
