import Header from '../components/Header';
import MatchCenter from '../components/MatchCenter';
import VideoSection from '../components/VideoSection';
import RightSidebar from '../components/RightSidebar';
import HomeArticleList from '../components/HomeArticleList';
import { getArticles } from '../lib/actions/article-actions';
import { getVideos } from '../lib/actions/video-actions';
import { scrapeSchedules } from '../lib/crawler/score-scraper';
import Link from 'next/link';
import { getCategorySlug } from '../lib/helpers';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const publishedArticles = await getArticles('published');
    const matches = await scrapeSchedules();

    const newsArticles = publishedArticles.filter((art: any) => art.category !== 'Soi Kèo');

    const newsInsights = newsArticles.map((art: any) => ({
        title: art.translatedTitle,
        category: art.category,
        excerpt: art.translatedContent.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        author: art.authorName || 'Tin Thể Thao 24h',
        authorAvatar: art.authorAvatar || '/author-avatar.png',
        date: new Date(art.createdAt).toLocaleDateString('vi-VN'),
        image: art.imageUrl || 'https://placehold.co/120x80',
        slug: art.slug
    }));


    const formattedVideos = await getVideos(8);

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />

            <main className="main-grid" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
                <section className="left-content">
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <h2 style={{ borderLeft: '5px solid #FFD700', paddingLeft: '1rem', marginBottom: '1.5rem' }}>Tin mới nhất</h2>
                        <HomeArticleList articles={newsInsights} />
                    </div>

                    <VideoSection videos={formattedVideos} />
                </section>

                <RightSidebar matches={matches} latestArticles={newsInsights} latestVideos={formattedVideos} />
            </main>
        </div>
    );
}
