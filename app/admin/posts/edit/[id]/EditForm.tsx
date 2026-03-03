'use client';

import { useState } from 'react';
import { updateArticle } from '@/lib/actions/article-actions';
import { useRouter } from 'next/navigation';

export default function EditForm({ article }: { article: any }) {
    const [title, setTitle] = useState(article.translatedTitle);
    const [content, setContent] = useState(article.translatedContent);
    const [status, setStatus] = useState(article.status);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const handleSave = async (newStatus?: string) => {
        setSaving(true);
        const res = await updateArticle(article._id, {
            translatedTitle: title,
            translatedContent: content,
            status: newStatus || status
        });
        if (res.success) {
            alert('Cập nhật thành công!');
            if (newStatus) setStatus(newStatus);
            router.refresh();
        } else {
            alert('Lỗi khi cập nhật.');
        }
        setSaving(false);
    };

    return (
        <div className="admin-card">
            <div className="admin-form-group">
                <label>Tiêu đề bài viết</label>
                <input
                    type="text"
                    className="admin-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="admin-form-group">
                <label>Nội dung bài viết (HTML)</label>
                <textarea
                    className="admin-input"
                    style={{ minHeight: '500px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.5' }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
                <button
                    className="btn-primary"
                    onClick={() => handleSave()}
                    disabled={saving}
                >
                    {saving ? 'Đang lưu...' : 'Lưu bản nháp'}
                </button>

                <button
                    className="btn-primary"
                    style={{ background: '#00a32a', borderColor: '#00a32a' }}
                    onClick={() => handleSave('published')}
                    disabled={saving}
                >
                    {saving ? 'Đang xử lý...' : 'Xuất bản công khai'}
                </button>

                <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#666' }}>
                    Trạng thái hiện tại: <strong>{status === 'published' ? 'Đã đăng' : 'Bản nháp'}</strong>
                </div>
            </div>
        </div>
    );
}
