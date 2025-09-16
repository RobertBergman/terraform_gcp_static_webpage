# AdSense Troubleshooting Guide

## Why Ads Aren't Showing

AdSense ads require several conditions to be met before they display:

### 1. ✅ Publisher ID Configuration
- Your publisher ID `ca-pub-7291878673566057` is correctly configured
- The AdSense script is properly loaded in the site header

### 2. ❌ Ad Unit Creation
**Action Required**: You need to create ad units in your AdSense dashboard:

1. Log into [Google AdSense](https://www.google.com/adsense)
2. Go to **Ads** → **By ad unit**
3. Create these ad units:
   - **Display ad - Vertical** (for sidebars)
   - **Display ad - Horizontal** (for mobile)
4. Get the ad slot IDs (format: `1234567890`)
5. Add them to your `.env.local`:
   ```env
   NEXT_PUBLIC_AD_SLOT_GAME_SIDEBAR_LEFT=1234567890
   NEXT_PUBLIC_AD_SLOT_GAME_SIDEBAR_RIGHT=0987654321
   NEXT_PUBLIC_AD_SLOT_GAME_MOBILE=5678901234
   ```

### 3. ❓ Domain Verification
Ensure your domain is verified in AdSense:
- Add your production domain (fatesblind.com) to AdSense
- Verify domain ownership

### 4. ⚠️ Development vs Production
- **Ads will NOT show on localhost** - This is normal
- Ads only display on approved, verified production domains
- In development, you'll see placeholder boxes showing where ads will appear

### 5. 📋 AdSense Approval Status
Check if your site has been approved:
- New sites need AdSense review and approval
- This can take 24-48 hours or longer
- Check your AdSense dashboard for approval status

## Current Implementation Status

✅ **Completed**:
- AdSense script added to site
- Ad components created
- Responsive ad placements configured
- Publisher ID integrated
- Placeholder system for development

❌ **Pending**:
- Create actual ad units in AdSense dashboard
- Add ad slot IDs to environment variables
- Deploy to production domain
- Wait for AdSense approval (if not already approved)

## Testing Your Ads

1. **In Development** (localhost):
   - You'll see green dashed boxes labeled "AdSense Ad"
   - This confirms the ad placements are working

2. **In Production**:
   - Deploy to your verified domain
   - Ads should appear within a few minutes if everything is configured
   - Check browser console for any AdSense errors

## Common Issues

### "Ads not showing on production"
- Check if domain is added to AdSense
- Verify ad units are created and active
- Ensure no ad blockers are running
- Check if site has sufficient content for approval

### "Console errors about AdSense"
- This is normal in development
- Ads will work properly on production domain

### "Blank spaces where ads should be"
- Ad units may take time to start serving ads
- Low traffic sites may not always have ads to display
- Check AdSense dashboard for policy violations