'use client'

import { useEffect } from 'react'
import AdPlaceholder from './AdPlaceholder'

interface GoogleAdProps {
  adClient: string
  adSlot: string
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function GoogleAd({
  adClient,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style,
  className = ''
}: GoogleAdProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const hasValidSlot = adSlot && !adSlot.includes('YOUR_AD_SLOT_ID')

  useEffect(() => {
    // Only try to load ads if we have valid configuration
    if (!isDevelopment && hasValidSlot) {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        }
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }
  }, [isDevelopment, hasValidSlot])

  // Show placeholder in development or when slots aren't configured
  if (isDevelopment || !hasValidSlot) {
    const dimensions = {
      vertical: { width: '300px', height: '600px' },
      horizontal: { width: '728px', height: '90px' },
      rectangle: { width: '336px', height: '280px' },
      auto: { width: '100%', height: '250px' },
      fluid: { width: '100%', height: 'auto' }
    }

    const dim = dimensions[adFormat] || dimensions.auto

    return (
      <AdPlaceholder
        width={style?.width as string || dim.width}
        height={style?.minHeight as string || style?.height as string || dim.height}
        label={`AdSense ${adFormat} Ad`}
      />
    )
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        ...style
      }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive}
    />
  )
}