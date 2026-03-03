"use client";

import { useState } from 'react';
import { deleteAuthor, toggleAuthorActive } from '@/lib/actions/author-actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Author {
    _id: string;
    name: string;
    role: string;
    bio: string;
    avatar: string;
    experience: number;
    specialties: string[];
    isActive: boolean;
    articleCount: number;
    lastAssignedAt?: string | null;
}

export default function AuthorList({ authors: initial }: { authors: Author[] }) {
    const [authors, setAuthors] = useState(initial);
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleToggle = async (id: string, current: boolean) => {
        setLoading(id + '-toggle');
        const res = await toggleAuthorActive(id, !current);
        if (res.success) {
            setAuthors(prev => prev.map(a => a._id === id ? { ...a, isActive: !current } : a));
        } else {
            alert(res.error);
        }
        setLoading(null);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Xóa tác giả "${name}"? Bài viết đã gán cho tác giả này sẽ vẫn giữ nguyên.`)) return;
        setLoading(id + '-delete');
        const res = await deleteAuthor(id);
        if (res.success) {
            setAuthors(prev => prev.filter(a => a._id !== id));
        } else {
            alert(res.error);
        }
        setLoading(null);
        router.refresh();
    };

    const activeCount = authors.filter(a => a.isActive).length;

    const cardStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '12px', border: '1px solid #eee',
        overflow: 'hidden', display: 'grid', gridTemplateColumns: 'auto 1fr auto',
        gap: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    };

    return (
        <div>
            {/* Summary bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[
                    { label: 'Tổng tác giả', value: authors.length, color: '#333' },
                    { label: 'Đang hoạt động', value: activeCount, color: '#28a745' },
                    { label: 'Tạm nghỉ', value: authors.length - activeCount, color: '#dc3545' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '0.8rem 1.5rem', textAlign: 'center', minWidth: '120px' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{s.label}</div>
                    </div>
                ))}
                <div style={{ marginLeft: 'auto', alignSelf: 'center' }}>
                    <Link href="/admin/authors/new" style={{ background: '#FFD700', color: '#000', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: '800', textDecoration: 'none', fontSize: '0.9rem' }}>
                        + Thêm tác giả mới
                    </Link>
                </div>
            </div>

            {authors.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#888', background: '#fff', borderRadius: '12px' }}>
                    Chưa có tác giả nào. <Link href="/admin/authors/new" style={{ color: '#0066cc' }}>Thêm tác giả đầu tiên</Link>
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {authors.map((author) => (
                    <div key={author._id} style={{ ...cardStyle, opacity: author.isActive ? 1 : 0.65 }}>
                        {/* Avatar */}
                        <div style={{ background: author.isActive ? '#000' : '#888', padding: '1.5rem 1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '130px' }}>
                            <div style={{ width: '75px', height: '75px', borderRadius: '50%', border: `3px solid ${author.isActive ? '#FFD700' : '#aaa'}`, overflow: 'hidden' }}>
                                <img src={author.avatar || '/author-avatar.png'} alt={author.name}
                                    width={75} height={75} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ background: author.isActive ? '#FFD700' : '#ccc', color: '#000', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800', textAlign: 'center' }}>
                                {author.experience} năm KN
                            </span>
                            <span style={{ fontSize: '0.65rem', color: author.isActive ? '#aaa' : '#bbb', textAlign: 'center' }}>
                                {author.isActive ? '🟢 Hoạt động' : '🔴 Tạm nghỉ'}
                            </span>
                        </div>

                        {/* Info */}
                        <div style={{ padding: '1.2rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>{author.name}</h3>
                                <span style={{ background: '#000', color: '#FFD700', padding: '2px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                                    {author.role}
                                </span>
                            </div>
                            <p style={{ margin: '0 0 0.75rem', color: '#666', fontSize: '0.87rem', lineHeight: 1.6 }}>
                                {author.bio.length > 130 ? author.bio.slice(0, 130) + '...' : author.bio}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {author.specialties?.map(s => (
                                    <span key={s} style={{ background: '#f0f0f0', color: '#444', padding: '2px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                            {author.lastAssignedAt && (
                                <p style={{ margin: '0.5rem 0 0', fontSize: '0.73rem', color: '#aaa' }}>
                                    Gán bài gần nhất: {new Date(author.lastAssignedAt).toLocaleString('vi-VN')}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ padding: '1.2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', minWidth: '130px', borderLeft: '1px solid #f0f0f0' }}>
                            <Link href={`/admin/authors/${author._id}`}
                                style={{ background: '#000', color: '#FFD700', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '700', textDecoration: 'none', fontSize: '0.82rem', textAlign: 'center' }}>
                                ✏️ Chỉnh sửa
                            </Link>
                            <button
                                onClick={() => handleToggle(author._id, author.isActive)}
                                disabled={loading === author._id + '-toggle'}
                                style={{ background: author.isActive ? '#fff3cd' : '#d4edda', color: author.isActive ? '#856404' : '#155724', border: '1px solid', borderColor: author.isActive ? '#ffc107' : '#28a745', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem' }}>
                                {author.isActive ? '⏸ Tạm nghỉ' : '▶️ Kích hoạt'}
                            </button>
                            <button
                                onClick={() => handleDelete(author._id, author.name)}
                                disabled={loading === author._id + '-delete'}
                                style={{ background: '#fff', color: '#dc3545', border: '1px solid #dc3545', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem' }}>
                                🗑 Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
