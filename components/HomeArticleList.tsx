"use client";

import { useState } from 'react';
import Link from 'next/link';
import { getCategorySlug } from '@/lib/helpers';

interface ArticleItem {
    title: string;
    category: string;
    excerpt: string;
    author: string;
    authorAvatar?: string;
    date: string;

    image: string;
    slug: string;
}

interface HomeArticleListProps {
    articles: ArticleItem[];
}

export default function HomeArticleList({ articles }: HomeArticleListProps) {
    const [displayCount, setDisplayCount] = useState(15);
    const hasMore = displayCount < articles.length;

    const currentArticles = articles.slice(0, displayCount);

    if (articles.length === 0) {
        return <div style={{ color: '#888', fontStyle: 'italic' }}>Đang cập nhật các bản tin chuyển nhượng mới nhất từ Tribal Football...</div>;
    }

    return (
        <div>
            <div style={{ display: 'grid', gap: '2rem' }}>
                {currentArticles.map((art: ArticleItem, i: number) => (
                    <div
                        key={i}
                        className="home-article-item"
                        style={{
                            paddingBottom: '2rem',
                            borderBottom: i < currentArticles.length - 1 ? '1px solid #f0f0f0' : 'none',
                            alignItems: 'flex-start'
                        }}
                    >
                        <div className="home-article-image-wrap" style={{ flexShrink: 0, borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                            <img
                                src={art.image}
                                className="home-article-image"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                alt={art.title}
                                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                        </div>
                        <div className="home-article-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                            <div>
                                <Link href={`/${getCategorySlug(art.category)}/${art.slug}`} style={{ fontSize: '1.35rem', fontWeight: '800', color: '#111', textDecoration: 'none', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {art.title}
                                </Link>
                                <p style={{ fontSize: '0.95rem', color: '#555', margin: '0.75rem 0', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {art.excerpt}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#888' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <img
                                        src={art.authorAvatar || "/author-avatar.png"}
                                        alt={art.author}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #FFD700' }}
                                    />
                                    <span style={{ fontWeight: '600', color: '#111' }}>{art.author}</span>
                                </div>
                                <span>{art.date}</span>
                            </div>


                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #f0f0f0' }}>
                    <button
                        onClick={() => setDisplayCount(prev => prev + 3)}
                        style={{
                            background: '#000',
                            color: '#FFD700',
                            border: 'none',
                            padding: '1rem 3.5rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                        }}
                    >
                        Xem Thêm <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>↓</span>
                    </button>
                </div>
            )}
        </div>
    );
}
