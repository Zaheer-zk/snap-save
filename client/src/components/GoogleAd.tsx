import React, { useEffect } from 'react';

const GOOGLE_ADS_CLIENT_ID = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID;

export const GoogleAdsScript = () => {
  useEffect(() => {
    if (!GOOGLE_ADS_CLIENT_ID) return;

    // Check if script is already present
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADS_CLIENT_ID}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      // Create cleanup function if needed, but ads usually stay for SPA navigation
    };
  }, []);

  return null;
};

interface GoogleAdProps {
  slot: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'fluid' | 'rectangle';
  layoutKey?: string;
  className?: string;
  responsive?: boolean;
}

export const GoogleAd = ({ 
  slot, 
  style, 
  format = 'auto', 
  layoutKey, 
  className,
  responsive = true 
}: GoogleAdProps) => {
  useEffect(() => {
    if (!GOOGLE_ADS_CLIENT_ID) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, []);

  if (!GOOGLE_ADS_CLIENT_ID) {
    if (process.env.NODE_ENV === 'development') {
        return (
            <div className={`bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-500 ${className}`} style={style}>
                <p className="font-bold">Google Ad Placeholder</p>
                <p className="text-sm">Add VITE_GOOGLE_ADS_CLIENT_ID to .env to enable ads</p>
                <p className="text-xs mt-2">Slot: {slot}</p>
            </div>
        );
    }
    return null;
  }

  return (
    <div className={className}>
      <ins className="adsbygoogle"
           style={{ display: 'block', ...style }}
           data-ad-client={GOOGLE_ADS_CLIENT_ID}
           data-ad-slot={slot}
           data-ad-format={format}
           data-full-width-responsive={responsive ? "true" : "false"}
           data-ad-layout-key={layoutKey}
      ></ins>
    </div>
  );
};
