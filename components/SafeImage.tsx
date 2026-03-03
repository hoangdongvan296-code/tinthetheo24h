'use client';

import { useState } from 'react';

interface SafeImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    wrapInFigure?: boolean;
    caption?: string;
}

export default function SafeImage({ src, alt, className, style, wrapInFigure, caption }: SafeImageProps) {
    const [error, setError] = useState(false);

    if (error || !src || !src.startsWith('http')) {
        return null;
    }

    const img = (
        <img
            src={src}
            alt={alt}
            className={className}
            style={style}
            onError={() => setError(true)}
        />
    );

    if (wrapInFigure) {
        return (
            <figure style={{ margin: '0 -2rem 3rem -2rem', textAlign: 'center' }}>
                {img}
                {caption && (
                    <figcaption style={{ color: '#888', marginTop: '1.2rem', fontStyle: 'italic', fontSize: '0.95rem', padding: '0 2rem' }}>
                        {caption}
                    </figcaption>
                )}
            </figure>
        );
    }

    return img;
}
