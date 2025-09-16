// Google AdSense Configuration
// Replace these values with your actual AdSense publisher ID and ad slot IDs

export const ADSENSE_CONFIG = {
  // Your AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-7291878673566057',

  // Ad Slot IDs for different placements
  adSlots: {
    // Vertical ads for game sidebars
    gameSidebarLeft: process.env.NEXT_PUBLIC_AD_SLOT_GAME_SIDEBAR_LEFT || 'YOUR_AD_SLOT_ID_1',
    gameSidebarRight: process.env.NEXT_PUBLIC_AD_SLOT_GAME_SIDEBAR_RIGHT || 'YOUR_AD_SLOT_ID_3',

    // Horizontal ads for mobile/tablet
    gameMobileHorizontal: process.env.NEXT_PUBLIC_AD_SLOT_GAME_MOBILE || 'YOUR_AD_SLOT_ID_2',

    // Other ad placements
    homePageBanner: process.env.NEXT_PUBLIC_AD_SLOT_HOME_BANNER || 'YOUR_AD_SLOT_ID_4',
    articleInline: process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_INLINE || 'YOUR_AD_SLOT_ID_5',
  }
}

// Helper function to check if ads are properly configured
export const isAdsenseConfigured = () => {
  // For now, just check if we have a valid publisher ID
  // AdSense auto ads can work without specific slot IDs
  return ADSENSE_CONFIG.publisherId !== 'ca-pub-YOUR_PUBLISHER_ID' &&
         ADSENSE_CONFIG.publisherId !== '' &&
         ADSENSE_CONFIG.publisherId.startsWith('ca-pub-')
}

// Check if specific ad slots are configured
export const hasAdSlots = () => {
  return !Object.values(ADSENSE_CONFIG.adSlots).some(slot =>
    slot.includes('YOUR_AD_SLOT_ID')
  )
}