import Header from '@/components/Header';
import { getArticlesByKeyword, getArticlesCountByKeyword } from '@/lib/actions/article-actions';
import { getCategorySlug } from '@/lib/helpers';
import Link from 'next/link';
import { Metadata } from 'next';

interface Props {
    searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `Tìm kiếm: "${q}" | Tin Thể Thao 24h` : 'Tìm kiếm | Tin Thể Thao 24h',
        description: q ? `Kết quả tìm kiếm cho "${q}" trên Tin Thể Thao 24h` : 'Tìm kiếm bài viết bóng đá, thể thao trên Tin Thể Thao 24h.',
        robots: { index: false, follow: true },
    };
}

const LIMIT = 15;

export default async function SearchPage({ searchParams }: Props) {
    const { q = '', page: pageStr = '1' } = await searchParams;
    const currentPage = Math.max(1, parseInt(pageStr));
    const query = q.trim();

    let articles: any[] = [];
    let totalCount = 0;

    if (query.length >= 2) {
        [articles, totalCount] = await Promise.all([
            getArticlesByKeyword(query, currentPage, LIMIT),
            getArticlesCountByKeyword(query),
        ]);
    }

    const totalPages = Math.ceil(totalCount / LIMIT);

    const buildUrl = (p: number) => `/search?q=${encodeURIComponent(query)}&page=${p}`;

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>

                {/* Search Box */}
                <form method="GET" action="/search" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', background: '#fff', border: '2px solid #FFD700', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                        <input
                            name="q"
                            type="search"
                            defaultValue={query}
                            autoFocus
                            placeholder="Tìm kiếm bài viết bóng đá, thể thao..."
                            style={{
                                flex: 1, border: 'none', padding: '1rem 1.25rem', fontSize: '1.1rem',
                                outline: 'none', color: '#111', background: 'transparent',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '1rem 1.5rem', background: '#FFD700', border: 'none',
                                fontWeight: '800', fontSize: '1rem', cursor: 'pointer', color: '#000',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            🔍 Tìm
                        </button>
                    </div>
                </form>

                {/* Results Header */}
                {query.length >= 2 && (
                    <div style={{ marginBottom: '1.5rem', color: '#555', fontSize: '0.95rem' }}>
                        {totalCount > 0
                            ? <>Tìm thấy <strong style={{ color: '#000' }}>{totalCount}</strong> kết quả cho <strong style={{ color: '#000' }}>&ldquo;{query}&rdquo;</strong></>
                            : <>Không tìm thấy kết quả nào cho <strong>&ldquo;{query}&rdquo;</strong>. Hãy thử từ khóa khác.</>
                        }
                    </div>
                )}

                {/* Article Cards */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {articles.map((art: any) => (
                        <Link
                            key={art._id?.toString()}
                            href={`/${getCategorySlug(art.category)}/${art.slug}`}
                            style={{ display: 'flex', gap: '1rem', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', border: '1px solid #eee', textDecoration: 'none', padding: '1rem' }}
                        >
                            {art.imageUrl && (
                                <img
                                    src={art.imageUrl} alt={art.translatedTitle}
                                    loading="lazy"
                                    style={{ width: '140px', height: '95px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                                />
                            )}
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.75rem', background: '#FFD700', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                                    {art.category}
                                </span>
                                <h2 style={{ margin: '0.4rem 0 0.5rem', fontSize: '1.05rem', fontWeight: '700', color: '#111', lineHeight: '1.4' }}>
                                    {art.translatedTitle}
                                </h2>
                                <p style={{ color: '#666', fontSize: '0.875rem', margin: '0 0 0.4rem', lineHeight: '1.5' }}>
                                    {art.translatedContent?.replace(/<[^>]*>/g, '').substring(0, 130)}...
                                </p>
                                <span style={{ color: '#999', fontSize: '0.78rem' }}>
                                    {new Date(art.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '2.5rem 0', flexWrap: 'wrap' }}>
                        {currentPage > 1 && (
                            <Link href={buildUrl(currentPage - 1)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #ddd', borderRadius: '6px', color: '#000', textDecoration: 'none', background: '#fff' }}>
                                ← Trước
                            </Link>
                        )}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => Math.abs(p - currentPage) <= 2)
                            .map(p => (
                                <Link key={p} href={buildUrl(p)} style={{ padding: '0.6rem 1rem', border: `2px solid ${p === currentPage ? '#FFD700' : '#ddd'}`, borderRadius: '6px', color: '#000', textDecoration: 'none', background: p === currentPage ? '#FFD700' : '#fff', fontWeight: p === currentPage ? '700' : '400' }}>
                                    {p}
                                </Link>
                            ))}
                        {currentPage < totalPages && (
                            <Link href={buildUrl(currentPage + 1)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #ddd', borderRadius: '6px', color: '#000', textDecoration: 'none', background: '#fff' }}>
                                Tiếp →
                            </Link>
                        )}
                    </div>
                )}

                {/* Empty state when no query */}
                {query.length < 2 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#999', fontSize: '1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        Nhập ít nhất 2 ký tự để tìm kiếm bài viết
                    </div>
                )}
            </main>
        </div>
    );
}
