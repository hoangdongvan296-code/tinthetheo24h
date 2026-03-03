import { getArticlesByKeyword, getArticlesCountByKeyword } from '@/lib/actions/article-actions';
import { capitalizeEachWord } from '@/lib/helpers';
import Header from '@/components/Header';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import RightSidebar from '@/components/RightSidebar';
import { scrapeSchedules } from '@/lib/crawler/score-scraper';
import { getVideos } from '@/lib/actions/video-actions';
import { getArticles } from '@/lib/actions/article-actions';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const name = capitalizeEachWord(slug);
    return {
        title: `Tin tức ${name} mới nhất | Tin Thể Thao 24h`,
        description: `Cập nhật tin tức, kết quả bóng đá, chuyển nhượng và thông tin mới nhất về ${name} liên tục 24/7.`,
    };
}

export default async function ClubPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const limit = 20;
    const name = capitalizeEachWord(slug);

    const articlesPromise = getArticlesByKeyword(name, currentPage, limit);
    const totalArticlesPromise = getArticlesCountByKeyword(name);
    const matchesPromise = scrapeSchedules();
    const latestArticlesPromise = getArticles('published');
    const latestVideosPromise = getVideos(5);

    const [articles, totalArticles, matches, latestArticlesRaw, latestVideos] = await Promise.all([
        articlesPromise,
        totalArticlesPromise,
        matchesPromise,
        latestArticlesPromise,
        latestVideosPromise
    ]);

    const totalPages = Math.ceil(totalArticles / limit);

    const latestArticlesFormatted = latestArticlesRaw.slice(0, 10).map((art: any) => ({
        title: art.translatedTitle,
        category: art.category,
        slug: art.slug,
        image: art.imageUrl,
    }));

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
            <Header />
            <main className="main-grid" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
                <div className="left-content">
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h1 style={{ padding: '1.5rem', margin: 0, borderBottom: '1px solid var(--border-color)', color: '#000', borderLeft: '5px solid #FFD700', fontSize: '1.8rem', fontWeight: '900' }}>
                            Câu lạc bộ: {name}
                        </h1>

                        <div style={{ padding: '1.5rem', display: 'grid', gap: '2rem' }}>
                            {articles.length === 0 ? (
                                <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                                    Hệ thống đang cập nhật thêm tin tức về {name}...
                                </p>
                            ) : (
                                <>
                                    {articles.map((art: any, i: number) => (
                                        <div key={art._id || i} className="category-article-item">
                                            {art.imageUrl && (
                                                <Link href={`/tin-tuc/${art.slug}`} style={{ flexShrink: 0 }}>
                                                    <img src={art.imageUrl} className="category-article-image" alt={art.translatedTitle} />
                                                </Link>
                                            )}
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>
                                                    <Link href={`/tin-tuc/${art.slug}`} style={{ color: '#000', textDecoration: 'none' }}>
                                                        {art.translatedTitle}
                                                    </Link>
                                                </h2>
                                                <p style={{ color: '#555', marginBottom: '0.8rem', lineHeight: '1.6', fontSize: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {art.translatedContent?.replace(/<[^>]*>/g, '').substring(0, 180)}...
                                                </p>
                                                <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: '600' }}>
                                                    {new Date(art.createdAt).toLocaleDateString('vi-VN')} • {art.category}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        baseUrl={`/clb/${slug}`}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sticky-sidebar">
                    <RightSidebar matches={matches} latestArticles={latestArticlesFormatted} latestVideos={latestVideos} />
                </div>
            </main>
        </div>
    );
}
