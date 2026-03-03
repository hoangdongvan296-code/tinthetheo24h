import Link from 'next/link';
import MatchCenter from './MatchCenter';
import AdSenseAd from './AdSenseAd';
import { getCategorySlug } from '@/lib/helpers';

interface RightSidebarProps {
    matches: any[];
    latestArticles: any[];
    latestVideos: any[];
    adsensePublisherId?: string;
    adsenseSlotSidebar?: string;
}

export default function RightSidebar({ matches, latestArticles, latestVideos, adsensePublisherId, adsenseSlotSidebar }: RightSidebarProps) {
    return (
        <aside className="sidebar">
            <MatchCenter initialMatches={matches} />

            {/* AdSense Sidebar Ad */}
            {adsensePublisherId && adsenseSlotSidebar && (
                <AdSenseAd
                    publisherId={adsensePublisherId}
                    slotId={adsenseSlotSidebar}
                    format="vertical"
                    style={{ marginTop: '2rem' }}
                />
            )}
            {/* Bài viết mới nhất Sidebar */}
            <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <h3 style={{ borderLeft: '5px solid var(--primary-color)', paddingLeft: '1rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '900' }}>Bài viết mới nhất</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>

                    {latestArticles.slice(0, 10).map((art: any, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                            <img
                                src={art.image || art.imageUrl}
                                style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                                alt={art.title || art.translatedTitle}
                                loading="lazy"
                                width={80}
                                height={50}
                            />
                            <Link href={`/${getCategorySlug(art.category)}/${art.slug}`} style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-color)', textDecoration: 'none', lineHeight: '1.4', transition: 'color 0.2s' }} className="sidebar-link">
                                {art.title || art.translatedTitle}
                            </Link>

                        </div>
                    ))}
                </div>
            </div>

            {/* Video mới nhất Sidebar */}
            <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
                <h3 style={{ borderLeft: '5px solid var(--primary-color)', paddingLeft: '1rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '900' }}>Video mới nhất</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>

                    {latestVideos.slice(0, 5).map((vid: any, i: number) => (
                        <div key={i} style={{ display: 'grid', gap: '0.5rem' }}>
                            <Link href={`/video/${vid.slug}--${vid.videoId}`} style={{ position: 'relative', display: 'block' }}>
                                <img
                                    src={vid.thumbnail}
                                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '4px' }}
                                    alt={vid.title}
                                    loading="lazy"
                                    width={300}
                                    height={170}
                                />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700', fontSize: '0.8rem' }}>▶</div>
                            </Link>
                            <Link href={`/video/${vid.slug}--${vid.videoId}`} style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#333', textDecoration: 'none', lineHeight: '1.3' }}>
                                {vid.title}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </aside>

    );
}

