'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Post {
    _id: string;
    translatedTitle?: string;
    originalTitle?: string;
    status: string;
    category: string;
    slug: string;
    createdAt: string;
}

function getCategorySlug(categoryName: string): string {
    const categoryMap: Record<string, string> = {
        'Ngoại hạng Anh': 'ngoai-hang-anh',
        'Champions League': 'champions-league',
        'La Liga': 'la-liga',
        'Bundesliga': 'bundesliga',
        'Serie A': 'serie-a',
        'Ligue 1': 'ligue-1',
        'Europa League': 'europa-league',
        'Chuyển nhượng': 'chuyen-nhuong',
        'Tin tức': 'tin-tuc',
        'Video': 'video',
    };
    return categoryMap[categoryName?.trim()] || 'tin-tuc';
}

export default function AdminPostsClient() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const url = filter === 'all'
                ? '/api/admin/posts/list'
                : `/api/admin/posts/list?status=${filter}`;
            const res = await fetch(url, { cache: 'no-store' });
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (err) {
            console.error('Lỗi tải danh sách bài viết:', err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Xóa bài viết:\n"${title}"\n\nHành động này không thể hoàn tác!`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setPosts(prev => prev.filter(p => p._id !== id));
            } else {
                alert('Xóa thất bại: ' + (data.message || 'Lỗi không xác định'));
            }
        } catch (err) {
            alert('Lỗi kết nối. Vui lòng thử lại.');
        } finally {
            setDeletingId(null);
        }
    };

    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.filter(p => p.status === 'draft').length;

    const filteredPosts = filter === 'all'
        ? posts
        : posts.filter(p => p.status === filter);

    return (
        <div>
            {/* Header */}
            <div className="admin-header">
                <h1>Bài viết (Posts)</h1>
                <Link href="/admin/posts/new" className="btn-primary" style={{ textDecoration: 'none' }}>
                    + Thêm bài mới
                </Link>
            </div>

            {/* Filter Tabs */}
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0', fontSize: '0.875rem', borderBottom: '1px solid #e2e8f0' }}>
                {(['all', 'published', 'draft'] as const).map((tab) => {
                    const label = tab === 'all' ? `Tất cả (${posts.length})` : tab === 'published' ? `Đã xuất bản (${publishedCount})` : `Bản nháp (${draftCount})`;
                    return (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                color: filter === tab ? '#2271b1' : '#666',
                                fontWeight: filter === tab ? '600' : 'normal',
                                borderBottom: filter === tab ? '2px solid #2271b1' : '2px solid transparent',
                                fontSize: '0.875rem',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
                <button
                    style={{ padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', color: '#d63638', fontSize: '0.875rem', marginLeft: 'auto' }}
                >
                    Thùng rác (0)
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                    Đang tải danh sách bài viết...
                </div>
            ) : filteredPosts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#888', background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                    Không có bài viết nào.
                </div>
            ) : (
                <table className="wp-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}><input type="checkbox" /></th>
                            <th>Tiêu đề</th>
                            <th style={{ width: '110px' }}>Trạng thái</th>
                            <th style={{ width: '150px' }}>Chuyên mục</th>
                            <th style={{ width: '100px' }}>Ngày đăng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post) => {
                            const title = post.translatedTitle || post.originalTitle || '(Không có tiêu đề)';
                            const isDeleting = deletingId === post._id;
                            const postUrl = `/${getCategorySlug(post.category)}/${post.slug}`;
                            const date = new Date(post.createdAt).toLocaleDateString('vi-VN');

                            return (
                                <tr key={post._id} style={{ opacity: isDeleting ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                                    <td><input type="checkbox" /></td>
                                    <td>
                                        <div style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '4px', lineHeight: '1.4' }}>
                                            {title}
                                        </div>
                                        <div style={{ display: 'flex', gap: '4px', fontSize: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Link
                                                href={`/admin/posts/edit/${post._id}`}
                                                style={{ color: '#2271b1', textDecoration: 'none', padding: '1px 6px', borderRadius: '3px', transition: 'background 0.15s' }}
                                                onMouseOver={e => (e.currentTarget.style.background = '#f0f6ff')}
                                                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                ✏️ Chỉnh sửa
                                            </Link>
                                            <span style={{ color: '#ccc' }}>|</span>
                                            <button
                                                onClick={() => handleDelete(post._id, title)}
                                                disabled={isDeleting}
                                                style={{
                                                    color: '#d63638',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.75rem',
                                                    padding: '1px 6px',
                                                    borderRadius: '3px',
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseOver={e => !isDeleting && ((e.currentTarget as HTMLElement).style.background = '#fff0f0')}
                                                onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                                            >
                                                {isDeleting ? '⏳ Đang xóa...' : '🗑️ Xóa'}
                                            </button>
                                            <span style={{ color: '#ccc' }}>|</span>
                                            <a
                                                href={postUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#2271b1', textDecoration: 'none', padding: '1px 6px', borderRadius: '3px', transition: 'background 0.15s' }}
                                                onMouseOver={e => (e.currentTarget.style.background = '#f0f6ff')}
                                                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                👁️ Xem
                                            </a>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                                            background: post.status === 'published' ? '#e6f4ea' : '#fff3e0',
                                            color: post.status === 'published' ? '#1e7e34' : '#e65100',
                                        }}>
                                            {post.status === 'published' ? '✅ Đã đăng' : '📋 Bản nháp'}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: '#555' }}>{post.category}</td>
                                    <td style={{ fontSize: '0.8rem', color: '#555', whiteSpace: 'nowrap' }}>{date}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {/* Refresh Button */}
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button
                    onClick={fetchPosts}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #ddd', background: '#f8f9fa', cursor: 'pointer', fontSize: '0.85rem', color: '#555' }}
                >
                    🔄 Tải lại danh sách
                </button>
            </div>
        </div>
    );
}
