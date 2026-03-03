import { getCategorySlug } from '@/lib/helpers';
import Header from '../../components/Header';
import { getArticles, getArticlesCount } from '../../lib/actions/article-actions';
import Link from 'next/link';
import Pagination from '../../components/Pagination';

const SITE_URL = 'https://tinthethao24h.com';

export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }) {
    const page = parseInt(searchParams.page || '1');
    const isPaginated = page > 1;
    return {
        title: isPaginated
            ? `Tin tức Ngoại hạng Anh - Trang ${page} | Tin Thể Thao 24h`
            : 'Tin tức Ngoại hạng Anh Mới Nhất | Kết Quả & BXH',
        description: 'Cập nhật tin tức Ngoại hạng Anh (Premier League) mới nhất 24/7. Tin chuyển nhượng, kết quả bóng đá, bảng xếp hạng và nhận định các trận đấu của MU, Liverpool, Man City, Arsenal.',
        // Canonical always points to page 1 — prevents duplicate content indexing
        alternates: { canonical: `${SITE_URL}/ngoai-hang-anh` },
        // Noindex paginated pages — only page 1 should be indexed
        robots: isPaginated
            ? { index: false, follow: true }
            : { index: true, follow: true, 'max-image-preview': 'large' },
        openGraph: {
            type: 'website',
            url: `${SITE_URL}/ngoai-hang-anh`,
            title: 'Tin tức Ngoại hạng Anh Mới Nhất | Tin Thể Thao 24h',
            description: 'Cập nhật tin tức Ngoại hạng Anh (Premier League) mới nhất 24/7.',
            siteName: 'Tin Thể Thao 24h',
        },
    };
}


export default async function NgoaiHangAnhPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const currentPage = parseInt(searchParams.page || '1');
    const limit = 20;
    const categoryQuery = 'Ngoại hạng Anh';

    const articles = await getArticles('published', categoryQuery, currentPage, limit);
    const totalArticles = await getArticlesCount('published', categoryQuery);
    const totalPages = Math.ceil(totalArticles / limit);

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />

            {/* ItemList JSON-LD Schema */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "name": "Tin tức Ngoại hạng Anh",
                    "description": "Danh sách tin tức Ngoại hạng Anh (Premier League) mới nhất",
                    "url": `${SITE_URL}/ngoai-hang-anh`,
                    "numberOfItems": articles.length,
                    "itemListElement": articles.slice(0, 10).map((art: any, index: number) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": art.translatedTitle,
                        "url": `${SITE_URL}/${getCategorySlug(art.category)}/${art.slug}`,
                    }))
                })
            }} />

            <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
                <h1 style={{ padding: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', color: '#000', borderLeft: '5px solid #FFD700' }}>
                    Tin tức Ngoại hạng Anh
                </h1>

                <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gap: '2rem' }}>
                    {articles.length === 0 ? (
                        <p style={{ color: '#666' }}>Hệ thống đang cập nhật tin tức Ngoại hạng Anh...</p>
                    ) : (
                        <>
                            {articles.map((art: any, i: number) => (
                                <div key={art._id || i} className="category-article-item">
                                    {art.imageUrl && (
                                        <img src={art.imageUrl} className="category-article-image" alt={art.translatedTitle} />
                                    )}
                                    <div>
                                        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>
                                            <Link href={`/${getCategorySlug(art.category)}/${art.slug}`} style={{ color: '#000', textDecoration: 'none' }}>
                                                {art.translatedTitle}
                                            </Link>
                                        </h2>
                                        <p style={{ color: '#666', marginBottom: '0.8rem', lineHeight: '1.6' }}>
                                            {art.translatedContent?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                                        </p>
                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                            {new Date(art.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                baseUrl="/ngoai-hang-anh"
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
