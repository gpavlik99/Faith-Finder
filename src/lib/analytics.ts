/**
 * Analytics utility for tracking user interactions
 */

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(eventName: string, properties?: EventProperties): void {
  if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_DEV_ANALYTICS) {
    console.log('📊 Analytics (dev):', eventName, properties);
    return;
  }

  try {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }

    // Plausible Analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(eventName, { props: properties });
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

export function trackPageView(): void {
  trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
}

export function trackSearch(params: {
  denomination?: string;
  size: string;
  location: string;
}): void {
  trackEvent('search_submitted', {
    denomination: params.denomination || 'no_preference',
    size: params.size,
    location: params.location,
  });
}

export function trackChurchClick(churchData: {
  id: string;
  name: string;
  rank?: number;
}): void {
  trackEvent('church_clicked', {
    church_id: churchData.id,
    church_name: churchData.name,
    rank: churchData.rank,
  });
}
