"use client";

import { useState } from 'react';
import Link from 'next/link';
import SafeImage from './SafeImage';
import { getCategorySlug } from '@/lib/helpers';

interface RelatedArticlesProps {
    articles: any[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
    const [displayCount, setDisplayCount] = useState(4);
    const hasMore = displayCount < articles.length;

    const currentArticles = articles.slice(0, displayCount);

    return (
        <div style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '5px solid #000' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '3rem', display: 'flex', alignItems: 'center' }}>
                <span>TIN TỨC LIÊN QUAN</span>
                <span style={{ flexGrow: 1, height: '4px', backgroundColor: '#f0f0f0', marginLeft: '2.5rem', borderRadius: '2px' }}></span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
                {currentArticles.map((rel: any) => (
                    <Link key={rel._id} href={`/${getCategorySlug(rel.category)}/${rel.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div style={{ position: 'relative', aspectRatio: '16/9', marginBottom: '1.2rem', overflow: 'hidden', borderRadius: '20px', backgroundColor: '#eee' }}>
                            <SafeImage
                                src={rel.imageUrl}
                                alt={rel.translatedTitle}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <h4 style={{ fontSize: '1.3rem', fontWeight: '800', lineHeight: '1.3', margin: 0 }}>
                            {rel.translatedTitle}
                        </h4>
                    </Link>
                ))}
            </div>

            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button
                        onClick={() => setDisplayCount(prev => prev + 4)}
                        style={{
                            background: '#000',
                            color: '#FFD700',
                            border: 'none',
                            padding: '1rem 3rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s, background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.background = '#222';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.background = '#000';
                        }}
                    >
                        Xem Thêm
                    </button>
                </div>
            )}
        </div>
    );
}
