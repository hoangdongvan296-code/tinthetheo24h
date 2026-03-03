import { getCategorySlug } from '@/lib/helpers';
import Header from '../../components/Header';
import { getArticles, getArticlesCount } from '../../lib/actions/article-actions';
import Link from 'next/link';
import Pagination from '../../components/Pagination';

export const metadata = {
    title: 'Tin Chuyển Nhượng Bóng Đá Mới Nhất 24h',
    description: 'Cập nhật tin tức chuyển nhượng bóng đá thế giới mới nhất 24h qua. Tin đồn chuyển nhượng, các thương vụ bom tấn tại Ngoại hạng Anh, la Liga, Serie A.',
};



export default async function ChuyenNhuongPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const currentPage = parseInt(searchParams.page || '1');
    const limit = 20;

    // Fetch articles for the specific category with pagination
    const category = 'Chuyển nhượng';
    const articles = await getArticles('published', category, currentPage, limit);
    const totalArticles = await getArticlesCount('published', category);
    const totalPages = Math.ceil(totalArticles / limit);

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
                <h1 style={{ padding: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', color: '#000', borderLeft: '5px solid #FFD700' }}>
                    Tin Tức Chuyển Nhượng
                </h1>

                <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gap: '2rem' }}>
                    {articles.length === 0 ? (
                        <p style={{ color: '#666' }}>Chưa có bài viết nào trong chuyên mục này.</p>
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
                                baseUrl="/chuyen-nhuong"
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
