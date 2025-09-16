'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function GAPathTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    if (typeof window === 'undefined') return;

    // Skip sending on initial load to avoid duplicate page_view
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // @ts-expect-error gtag is injected by the GA snippet
    const gtag = window.gtag as undefined | ((...args: unknown[]) => void);
    if (typeof gtag !== 'function') return;

    const query = searchParams?.toString();
    const page_path = query ? `${pathname}?${query}` : pathname || '/';
    const page_title = typeof document !== 'undefined' ? document.title : undefined;
    const page_location = typeof window !== 'undefined' ? window.location.href : undefined;

    // For GA4 SPA tracking, update config with the new page path
    // @ts-expect-error gtag is injected by the GA snippet
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path,
      page_title,
      page_location,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GAPathTracker() {
  if (!GA_MEASUREMENT_ID) return null;
  
  return (
    <Suspense fallback={null}>
      <GAPathTrackerInner />
    </Suspense>
  );
}
