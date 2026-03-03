"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SafeImage from './SafeImage';
import { getCategorySlug } from '@/lib/helpers';

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/articles/search?query=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data || []);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '5rem 1rem', animation: 'overlayFadeIn 0.3s ease forwards'
            }}
        >
            <button
                onClick={onClose}
                style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', outline: 'none' }}
            >
                <X size={40} />
            </button>

            <div style={{ width: '100%', maxWidth: '800px', animation: 'searchSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <div style={{ position: 'relative', marginBottom: '3rem' }}>
                    <Search
                        size={28}
                        style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#FFD700' }}
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,215,0,0.3)',
                            borderRadius: '50px', padding: '1.2rem 1.2rem 1.2rem 4rem', fontSize: '1.5rem',
                            color: '#fff', outline: 'none', transition: 'all 0.3s ease'
                        }}
                    />
                    {loading && <Loader2 size={24} className="animate-spin" style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#FFD700' }} />}
                </div>

                <div
                    style={{
                        maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem',
                        paddingRight: '10px', scrollbarWidth: 'thin'
                    }}
                >
                    {results.map((art: any) => (
                        <Link
                            key={art._id}
                            href={`/${getCategorySlug(art.category)}/${art.slug}`}
                            onClick={onClose}
                            style={{
                                display: 'flex', gap: '1.5rem', background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1rem',
                                textDecoration: 'none', color: '#fff', transition: 'all 0.2s ease',
                                alignItems: 'center'
                            }}
                            className="search-result-item"
                        >
                            <div style={{ width: '100px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                <img src={art.imageUrl} alt={art.translatedTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.7rem', color: '#FFD700', fontWeight: 'bold', marginBottom: '4px' }}>{art.category.toUpperCase()}</div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', lineHeight: '1.4' }}>{art.translatedTitle}</h4>
                            </div>
                            <ArrowRight size={20} style={{ opacity: 0.3 }} />
                        </Link>
                    ))}

                    {query.trim().length >= 2 && results.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>Không tìm thấy bài viết nào phù hợp.</div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .search-result-item:hover {
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 215, 0, 0.4) !important;
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
}
