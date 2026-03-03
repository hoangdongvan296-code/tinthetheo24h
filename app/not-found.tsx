import Header from '@/components/Header';
import Link from 'next/link';
import { getArticles } from '@/lib/actions/article-actions';
import { getCategorySlug } from '@/lib/helpers';

export default async function NotFound() {
    let latestArticles: any[] = [];
    try {
        latestArticles = await getArticles('published', undefined, 1, 6);
    } catch { /* silent */ }

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '900px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>

                {/* Hero 404 */}
                <div style={{ padding: '3rem 2rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '3rem', border: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '6rem', fontWeight: '900', color: '#FFD700', lineHeight: 1, marginBottom: '1rem', textShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        404
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111', marginBottom: '1rem' }}>
                        Trang không tìm thấy
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.7' }}>
                        Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.<br />
                        Hãy thử tìm kiếm bài viết khác hoặc quay về trang chủ.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/" style={{
                            padding: '0.85rem 2rem', background: '#000', color: '#FFD700',
                            borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '1rem'
                        }}>
                            🏠 Về Trang Chủ
                        </Link>
                        <Link href="/search" style={{
                            padding: '0.85rem 2rem', background: '#FFD700', color: '#000',
                            borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '1rem'
                        }}>
                            🔍 Tìm Kiếm
                        </Link>
                    </div>
                </div>

                {/* Gợi ý bài viết mới */}
                {latestArticles.length > 0 && (
                    <div style={{ textAlign: 'left' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem', borderLeft: '4px solid #FFD700', paddingLeft: '0.75rem' }}>
                            Bài viết mới nhất
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                            {latestArticles.map((art: any) => (
                                <Link
                                    key={art._id?.toString()}
                                    href={`/${getCategorySlug(art.category)}/${art.slug}`}
                                    style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', textDecoration: 'none', display: 'block', transition: 'transform 0.2s' }}
                                >
                                    {art.imageUrl && (
                                        <img
                                            src={art.imageUrl} alt={art.translatedTitle}
                                            style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                    )}
                                    <div style={{ padding: '1rem' }}>
                                        <span style={{ fontSize: '0.75rem', background: '#FFD700', color: '#000', borderRadius: '4px', padding: '2px 8px', fontWeight: '700' }}>
                                            {art.category}
                                        </span>
                                        <p style={{ marginTop: '0.6rem', fontWeight: '700', color: '#111', fontSize: '0.95rem', lineHeight: '1.4' }}>
                                            {art.translatedTitle}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
