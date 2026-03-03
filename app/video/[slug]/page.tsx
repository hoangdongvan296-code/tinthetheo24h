import Header from '../../../components/Header';
import RightSidebar from '../../../components/RightSidebar';
import { getVideoById, getVideos } from '../../../lib/actions/video-actions';
import { getArticles } from '../../../lib/actions/article-actions';
import { scrapeSchedules } from '../../../lib/crawler/score-scraper';
import { notFound } from 'next/navigation';
import VideoSection from '../../../components/VideoSection';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const videoId = slug.split('--').pop() || '';
    const video = await getVideoById(videoId);
    if (!video) return { title: 'Video Not Found | Bongda 2026' };
    return { title: `${video.title} | Bongda 2026 Video` };
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const videoId = slug.split('--').pop() || '';

    const videoPromise = getVideoById(videoId);
    const matchesPromise = scrapeSchedules();
    const latestArticlesPromise = getArticles('published');
    const latestVideosPromise = getVideos(12);

    const [video, matches, latestArticlesRaw, latestVideos] = await Promise.all([
        videoPromise,
        matchesPromise,
        latestArticlesPromise,
        latestVideosPromise
    ]);

    if (!video) {
        notFound();
    }

    const newsArticles = latestArticlesRaw.filter((art: any) => art.category !== 'Soi Kèo');
    const latestArticlesFormatted = newsArticles.map((art: any) => ({
        title: art.translatedTitle,
        category: art.category,
        slug: art.slug,
        image: art.imageUrl,
    }));

    // Filter out current video for the bottom section
    const otherVideos = latestVideos.filter(v => v.videoId !== videoId).slice(0, 8);

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />
            <main className="main-grid" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
                <div className="left-content">
                    <div className="video-detail-container" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', padding: '2rem', marginBottom: '2rem' }}>

                        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.25', color: '#000', letterSpacing: '-0.01em' }}>
                            {video.title}
                        </h1>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            <span style={{ background: '#FFD700', color: '#000', padding: '4px 12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                {video.league.toUpperCase()}
                            </span>
                            <span style={{ color: '#666' }}>
                                {new Date(video.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>

                        <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ display: 'block' }}
                            ></iframe>
                        </div>
                    </div>

                    {otherVideos.length > 0 && (
                        <div className="video-detail-container" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #eee', marginBottom: '2rem' }}>
                            <VideoSection videos={otherVideos} title="Video mới nhất" />
                        </div>
                    )}
                </div>

                <RightSidebar matches={matches} latestArticles={latestArticlesFormatted} latestVideos={latestVideos} />
            </main>
        </div>
    );
}
