#!/bin/bash

# Script to generate placeholder images for the Fatesblind gallery
# Uses ImageMagick to create colored placeholder images with text

set -e

echo "🎨 Generating placeholder images for Fatesblind gallery..."

# Create images directory if it doesn't exist
mkdir -p public/images

# Colors from the Fatesblind theme
COLOR_PRIMARY="#6b2d5c"
COLOR_SECONDARY="#8b4513"
COLOR_ACCENT="#d4a574"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed."
    echo "   Install it with:"
    echo "   - Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "   - macOS: brew install imagemagick"
    echo ""
    echo "   Or download placeholder images manually from:"
    echo "   https://unsplash.com/"
    exit 1
fi

# Generate placeholder images
echo "📸 Creating Red Mountain Vineyard placeholders..."
convert -size 1600x1200 "xc:$COLOR_PRIMARY" \
  -pointsize 72 -fill white -gravity center \
  -font DejaVu-Sans-Bold \
  -annotate +0-50 "Red Mountain Vineyards" \
  -pointsize 48 -annotate +0+50 "Replace with actual photo" \
  public/images/red-mountain-vineyard-1.jpg

convert -size 1600x1200 "xc:$COLOR_SECONDARY" \
  -pointsize 72 -fill white -gravity center \
  -font DejaVu-Sans-Bold \
  -annotate +0-50 "Red Mountain at Sunset" \
  -pointsize 48 -annotate +0+50 "Replace with actual photo" \
  public/images/red-mountain-vineyard-2.jpg

echo "🚵 Creating #2 Canyon placeholders..."
convert -size 1600x1200 "xc:$COLOR_ACCENT" \
  -pointsize 72 -fill "#2c2c2c" -gravity center \
  -font DejaVu-Sans-Bold \
  -annotate +0-50 "#2 Canyon Trails" \
  -pointsize 48 -annotate +0+50 "Replace with actual photo" \
  public/images/canyon-2-wenatchee-1.jpg

convert -size 1600x1200 "xc:$COLOR_PRIMARY" \
  -pointsize 72 -fill white -gravity center \
  -font DejaVu-Sans-Bold \
  -annotate +0-50 "#2 Canyon Views" \
  -pointsize 48 -annotate +0+50 "Replace with actual photo" \
  public/images/canyon-2-wenatchee-2.jpg

echo "🍷 Creating Kiona Vineyard wine placeholders..."
convert -size 1600x1200 "xc:$COLOR_SECONDARY" \
  -pointsize 72 -fill white -gravity center \
  -font DejaVu-Sans-Bold \
  -annotate +0-50 "Kiona Vineyard Wines" \
  -pointsize 48 -annotate +0+50 "Replace with actual photo" \
  public/images/kiona-wine-bottles-1.jpg

convert -size 1600x1200 "xc:$COLOR_ACCENT" \
  -pointsize 72 -fill "#2c2c2c" -gravity center \
  -font DejaVu-Sans-Bold \
  -annotate +0-50 "Kiona Collection" \
  -pointsize 48 -annotate +0+50 "Replace with actual photo" \
  public/images/kiona-wine-bottles-2.jpg

echo "✅ Placeholder images created successfully!"
echo ""
echo "📁 Images saved to: public/images/"
echo ""
echo "🚀 Next steps:"
echo "   1. Start the dev server: npm run dev"
echo "   2. Visit http://localhost:5173 to see the gallery"
echo "   3. Replace placeholders with your actual photos"
echo ""
echo "📖 See IMAGE_SETUP_GUIDE.md for detailed instructions"
