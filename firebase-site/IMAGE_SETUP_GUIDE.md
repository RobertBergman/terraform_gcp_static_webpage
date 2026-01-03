# Image Setup Guide for Fatesblind Landing Page

This guide will help you add images of Red Mountain Vineyards, #2 Canyon in Wenatchee, and Kiona Vineyard wine bottles to your landing page.

## Required Images

The gallery expects **6 images** with the following naming convention:

### Red Mountain Vineyards (2 images)
1. `red-mountain-vineyard-1.jpg` - Rolling hills with grapevines
2. `red-mountain-vineyard-2.jpg` - Sunset over vineyard rows

### #2 Canyon, Wenatchee (2 images)
3. `canyon-2-wenatchee-1.jpg` - Mountain biking trails
4. `canyon-2-wenatchee-2.jpg` - Scenic overlook

### Kiona Vineyard Wines (2 images)
5. `kiona-wine-bottles-1.jpg` - Wine bottles
6. `kiona-wine-bottles-2.jpg` - Wine collection

## Where to Place Images

All images should be placed in the `public/images/` directory:

```
/home/rbergman/fatesblind/public/images/
├── red-mountain-vineyard-1.jpg
├── red-mountain-vineyard-2.jpg
├── canyon-2-wenatchee-1.jpg
├── canyon-2-wenatchee-2.jpg
├── kiona-wine-bottles-1.jpg
└── kiona-wine-bottles-2.jpg
```

## How to Add Your Images

### Option 1: Copy Existing Images (Recommended)
If you already have the images on your computer:

```bash
# Copy images to the public/images directory
cp /path/to/your/images/*.jpg /home/rbergman/fatesblind/public/images/

# Or move them
mv /path/to/your/images/*.jpg /home/rbergman/fatesblind/public/images/
```

### Option 2: Download from Your Phone/Camera
1. Transfer photos from your phone or camera to your computer
2. Rename them according to the naming convention above
3. Copy them to `/home/rbergman/fatesblind/public/images/`

### Option 3: Use Stock/Personal Photography
If you need to take or source new photos:

#### Red Mountain Vineyards
- Visit Red Mountain AVA (American Viticultural Area) in Benton City, WA
- Best time: Golden hour (sunset) for dramatic lighting
- Focus on: Rolling vineyard rows, grape clusters, landscape vistas

#### #2 Canyon, Wenatchee
- Location: Wenatchee, WA (part of the trail system)
- Capture: Mountain biking trails, canyon views, scenic overlooks
- Best time: Morning or late afternoon for optimal lighting

#### Kiona Vineyard Wine Bottles
- Visit Kiona Vineyards & Winery tasting room
- Ask permission to photograph bottles
- Focus on: Bottle labels, wine selections, artistic arrangements
- Alternative: Use your own collection of Kiona wines

## Image Specifications

For best results, optimize your images:

### Recommended Dimensions
- **Width**: 1200-1600px
- **Height**: 900-1200px (4:3 aspect ratio works best)
- **File Size**: Under 500KB per image (compressed for web)

### Image Optimization Tools

#### Command Line (ImageMagick)
```bash
# Install ImageMagick (if not already installed)
sudo apt-get install imagemagick  # Ubuntu/Debian
# or
brew install imagemagick  # macOS

# Optimize images (resize and compress)
cd /home/rbergman/fatesblind/public/images/

# Resize to max 1600px width, maintain aspect ratio
mogrify -resize 1600x1600\> -quality 85 *.jpg

# Or process one at a time
convert original.jpg -resize 1600x1600\> -quality 85 red-mountain-vineyard-1.jpg
```

#### Online Tools (No Installation Required)
- **TinyPNG** - https://tinypng.com/ (drag & drop, automatic compression)
- **Squoosh** - https://squoosh.app/ (Google's image optimizer)
- **Compressor.io** - https://compressor.io/

### File Format Recommendations
- **JPEG (.jpg)** - Best for photographs (recommended)
- **WebP** - Modern format, smaller file sizes (optional, for advanced users)

## Using Placeholder Images During Development

If you don't have images yet, you can use placeholder services:

### Option 1: Unsplash (Free, High-Quality)
```bash
cd /home/rbergman/fatesblind/public/images/

# Download sample wine/vineyard images from Unsplash
curl -o red-mountain-vineyard-1.jpg "https://source.unsplash.com/1600x1200/?vineyard,washington"
curl -o red-mountain-vineyard-2.jpg "https://source.unsplash.com/1600x1200/?wine,grapes"
curl -o canyon-2-wenatchee-1.jpg "https://source.unsplash.com/1600x1200/?mountain-biking,trail"
curl -o canyon-2-wenatchee-2.jpg "https://source.unsplash.com/1600x1200/?canyon,landscape"
curl -o kiona-wine-bottles-1.jpg "https://source.unsplash.com/1600x1200/?wine-bottle"
curl -o kiona-wine-bottles-2.jpg "https://source.unsplash.com/1600x1200/?wine,collection"
```

### Option 2: Create Colored Placeholders
```bash
cd /home/rbergman/fatesblind/public/images/

# Using ImageMagick to create placeholder images
convert -size 1600x1200 xc:#6b2d5c -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "Red Mountain\nVineyard 1" red-mountain-vineyard-1.jpg

convert -size 1600x1200 xc:#8b4513 -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "Red Mountain\nVineyard 2" red-mountain-vineyard-2.jpg

convert -size 1600x1200 xc:#d4a574 -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "#2 Canyon\nWenatchee 1" canyon-2-wenatchee-1.jpg

convert -size 1600x1200 xc:#6b2d5c -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "#2 Canyon\nWenatchee 2" canyon-2-wenatchee-2.jpg

convert -size 1600x1200 xc:#8b4513 -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "Kiona Wine\nBottles 1" kiona-wine-bottles-1.jpg

convert -size 1600x1200 xc:#d4a574 -pointsize 72 -fill white -gravity center \
  -annotate +0+0 "Kiona Wine\nBottles 2" kiona-wine-bottles-2.jpg
```

## Testing Your Images

After adding images, test the gallery:

```bash
cd /home/rbergman/fatesblind

# Start the development server
npm run dev
```

Visit `http://localhost:5173` and:
1. Check that all 6 images load correctly
2. Verify hover effects work smoothly
3. Test responsive design on different screen sizes
4. Ensure images look good with overlay text

## Customizing the Gallery

If you want to change the images displayed, edit:

**File**: `src/components/ImageGallery.jsx`

```javascript
const images = [
  {
    id: 1,
    src: '/images/your-custom-image.jpg',  // Change filename here
    alt: 'Your custom description',         // Update alt text
    title: 'Your Custom Title',             // Update title
    description: 'Your custom description', // Update description
  },
  // ... more images
];
```

## Adding More Images

To add additional images beyond the initial 6:

1. Add the image file to `public/images/`
2. Edit `src/components/ImageGallery.jsx`
3. Add a new object to the `images` array:

```javascript
{
  id: 7,  // Increment ID
  src: '/images/new-image.jpg',
  alt: 'Description for accessibility',
  title: 'Image Title',
  description: 'Brief description shown on hover',
}
```

## Troubleshooting

### Images Not Displaying
1. Check file names match exactly (case-sensitive on Linux)
2. Ensure images are in `/home/rbergman/fatesblind/public/images/`
3. Verify file extensions are `.jpg` (not `.jpeg`, `.JPG`, etc.)
4. Restart the development server (`npm run dev`)

### Images Loading Slowly
1. Compress images using the optimization tools above
2. Target file sizes under 500KB each
3. Consider using WebP format for better compression

### Broken Layout
1. Ensure images have similar aspect ratios (4:3 recommended)
2. Check that image files aren't corrupted
3. Verify CSS is loading correctly

## Build and Deploy

Once images are added and tested:

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

The images will be included in the `dist/` folder and deployed with your site.

## Resources

- **Red Mountain Wine Region**: https://redmountainava.com/
- **Wenatchee Trails**: https://www.wvmba.org/
- **Kiona Vineyards**: https://kionawine.com/
- **Unsplash Free Photos**: https://unsplash.com/
- **Image Optimization Guide**: https://web.dev/fast/#optimize-your-images

---

**Need Help?** Check the main README.md or create an issue if you encounter problems.
