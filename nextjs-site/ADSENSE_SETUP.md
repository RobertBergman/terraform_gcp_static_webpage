# Google AdSense Setup Guide

## Current Configuration

Your AdSense publisher ID (`ca-pub-7291878673566057`) has been integrated into the site. The AdSense script is automatically loaded on all pages.

## Ad Placements on Asteroids Game

The Asteroids game page has been configured with three ad placement zones:

1. **Left Sidebar (Desktop only)**: Vertical ad unit, 160-300px wide
2. **Right Sidebar (Desktop only)**: Vertical ad unit, 160-300px wide
3. **Mobile Horizontal (Mobile/Tablet only)**: Horizontal ad unit below game controls

## Next Steps

### 1. Create Ad Units in Google AdSense

1. Log into your [Google AdSense account](https://www.google.com/adsense)
2. Navigate to **Ads** → **By ad unit** → **Display ads**
3. Create three ad units:
   - **Game Sidebar Left**: Display ad, Vertical format
   - **Game Sidebar Right**: Display ad, Vertical format
   - **Game Mobile**: Display ad, Horizontal format
4. Copy the ad slot IDs (format: `1234567890`)

### 2. Configure Environment Variables

Add the ad slot IDs to your `.env.local` file:

```env
NEXT_PUBLIC_AD_SLOT_GAME_SIDEBAR_LEFT=1234567890
NEXT_PUBLIC_AD_SLOT_GAME_SIDEBAR_RIGHT=0987654321
NEXT_PUBLIC_AD_SLOT_GAME_MOBILE=5678901234
```

### 3. Deploy to Production

For App Engine deployment, add these to `app.yaml`:

```yaml
env_variables:
  NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: "ca-pub-7291878673566057"
  NEXT_PUBLIC_AD_SLOT_GAME_SIDEBAR_LEFT: "your_slot_id"
  NEXT_PUBLIC_AD_SLOT_GAME_SIDEBAR_RIGHT: "your_slot_id"
  NEXT_PUBLIC_AD_SLOT_GAME_MOBILE: "your_slot_id"
```

## Ad Display Requirements

- Ads will only display when:
  - The site is deployed to your verified domain
  - Ad units have been created and approved in AdSense
  - The domain is added to your AdSense account
  - There is sufficient traffic/content for ads to be served

## Testing

During development, you may see blank spaces where ads should appear. This is normal. Ads will only display on the production domain after:
1. Site verification
2. AdSense approval
3. Ad unit creation

## Responsive Design

- **Desktop (lg+)**: Shows game with vertical ads on both sides
- **Tablet/Mobile**: Shows game full-width with horizontal ad below controls
- Ads are hidden if not properly configured to avoid layout issues