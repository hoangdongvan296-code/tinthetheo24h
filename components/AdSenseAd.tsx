"use client";

import { useEffect } from 'react';

interface AdSenseAdProps {
    publisherId: string;
    slotId: string;
    format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
    style?: React.CSSProperties;
    className?: string;
}

export default function AdSenseAd({ publisherId, slotId, format = 'auto', style, className }: AdSenseAdProps) {
    useEffect(() => {
        try {
            // Push the ad only once the element is in the DOM
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
            // Ignore errors in development
        }
    }, []);

    if (!publisherId || !slotId) return null;

    return (
        <div className={className} style={{ textAlign: 'center', overflow: 'hidden', ...style }}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={publisherId}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}
