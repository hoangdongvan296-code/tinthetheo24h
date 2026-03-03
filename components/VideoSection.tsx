"use client";

import Link from 'next/link';

export interface VideoHighlight {
    title: string;
    slug: string;
    videoUrl: string;
    thumbnail: string;
    league: string;
}

export default function VideoSection({ videos, title }: { videos: VideoHighlight[], title?: string }) {
    const extractVideoId = (url: string) => {
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    };

    return (
        <div className="video-section" style={{ marginTop: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem', borderLeft: '5px solid #FFD700', paddingLeft: '1rem' }}>
                {title || "Video Highlights & Bàn thắng"}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {videos.map((vid, i) => {
                    const videoId = extractVideoId(vid.videoUrl);

                    return (
                        <Link href={`/video/${vid.slug}--${videoId}`} key={i} className="video-card" style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                            <div
                                style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                            >
                                <img
                                    src={vid.thumbnail}
                                    alt={vid.title}
                                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                <div
                                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700', fontSize: '1.5rem', transition: 'background 0.2s', pointerEvents: 'none' }}
                                >
                                    ▶
                                </div>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 'bold', marginBottom: '4px' }}>{vid.league.toUpperCase()}</div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', lineHeight: '1.4' }}>{vid.title}</div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
