import { getCategorySlug } from '@/lib/helpers';
import Link from 'next/link';
import { getArticles } from '../../../lib/actions/article-actions';

export default async function AdminPosts({
    searchParams,
}: {
    searchParams: { status?: string };
}) {
    const currentStatus = searchParams?.status;
    const posts = await getArticles(currentStatus);
    const allPosts = await getArticles(); // For total counts

    return (
        <div>
            <div className="admin-header">
                <h1>Bài viết (Posts)</h1>
                <button className="btn-primary">+ Thêm bài mới</button>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                <Link href="/admin/posts" style={{ color: '#2271b1', fontWeight: !currentStatus ? 'bold' : 'normal' }}>
                    Tất cả ({allPosts.length})
                </Link> |
                <Link href="/admin/posts?status=published" style={{ color: '#2271b1', fontWeight: currentStatus === 'published' ? 'bold' : 'normal' }}>
                    Đã xuất bản ({allPosts.filter((p: any) => p.status === 'published').length})
                </Link> |
                <Link href="/admin/posts?status=draft" style={{ color: '#2271b1', fontWeight: currentStatus === 'draft' ? 'bold' : 'normal' }}>
                    Bản nháp ({allPosts.filter((p: any) => p.status === 'draft').length})
                </Link> |
                <a href="#" style={{ color: '#d63638' }}>Thùng rác (0)</a>
            </div>

            <table className="wp-table">
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}><input type="checkbox" /></th>
                        <th>Tiêu đề</th>
                        <th>Trạng thái</th>
                        <th>Chuyên mục</th>
                        <th>Ngày đăng</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                Chưa có bài viết nào trong hệ thống.
                            </td>
                        </tr>
                    ) : (
                        posts.map((post: any) => (
                            <tr key={post._id}>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <div style={{ fontWeight: '600', color: '#2271b1', marginBottom: '4px' }}>{post.translatedTitle || post.originalTitle}</div>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem' }}>
                                        <Link href={`/admin/posts/edit/${post._id}`} style={{ color: '#2271b1' }}>Chỉnh sửa</Link> |
                                        <a href="#" style={{ color: '#2271b1' }}>Sửa nhanh</a> |
                                        <button style={{ color: '#d63638', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>Xóa</button> |
                                        <a href={`/${getCategorySlug(post.category)}/${post.slug}`} target="_blank" style={{ color: '#2271b1' }}>Xem</a>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge status-${post.status}`}>
                                        {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                                    </span>
                                </td>
                                <td>{post.category}</td>
                                <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
