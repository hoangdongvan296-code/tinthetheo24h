"use client";

import { useState } from 'react';

interface ShareButtonsProps {
    url: string;
    title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shares = [
        {
            name: 'Facebook',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            bg: '#1877F2', color: '#fff',
        },
        {
            name: 'X / Twitter',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            bg: '#000', color: '#fff',
        },
        {
            name: 'Zalo',
            icon: (
                <svg width="18" height="18" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm8.5 27.5h-2.2l-4.1-5.5v5.5H24V16.5h2.2v5.3l4-5.3h2.4l-4.4 5.8 4.3 5.7zm-10.8 0H14V16.5h7.7v1.8h-5.5v3.9h5.1v1.8h-5.1v4h5.5v1.7l-.5.5z" />
                </svg>
            ),
            href: `https://zalo.me/share/post?u=${encodedUrl}&t=${encodedTitle}`,
            bg: '#0068FF', color: '#fff',
        },
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const el = document.createElement('textarea');
            el.value = url;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const btnBase: React.CSSProperties = {
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.55rem 1rem', borderRadius: '8px', border: 'none',
        cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem',
        textDecoration: 'none', transition: 'opacity 0.2s',
        whiteSpace: 'nowrap',
    };

    return (
        <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '1.5rem', marginTop: '2rem' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#555', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📤 Chia sẻ bài viết
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {shares.map((s) => (
                    <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...btnBase, background: s.bg, color: s.color }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        {s.icon}
                        {s.name}
                    </a>
                ))}

                {/* Copy link */}
                <button
                    onClick={handleCopy}
                    style={{ ...btnBase, background: copied ? '#28a745' : '#f0f0f0', color: copied ? '#fff' : '#333' }}
                    onMouseEnter={e => !copied && ((e.currentTarget as HTMLElement).style.background = '#e0e0e0')}
                    onMouseLeave={e => !copied && ((e.currentTarget as HTMLElement).style.background = '#f0f0f0')}
                >
                    {copied ? (
                        <>✅ Đã sao chép!</>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Sao chép link
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
