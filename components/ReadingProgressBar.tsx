"use client";

import { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollTotal <= 0) {
                setProgress(100);
                return;
            }
            const currentScroll = window.scrollY;
            const scrollPercentage = (currentScroll / scrollTotal) * 100;
            setProgress(Math.min(100, Math.max(0, scrollPercentage)));
        };

        window.addEventListener('scroll', updateProgress);
        // Initial check
        updateProgress();

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', zIndex: 10000, pointerEvents: 'none' }}>
            <div
                style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: '#FFD700',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
                    transition: 'width 0.1s ease-out'
                }}
            />
        </div>
    );
}
