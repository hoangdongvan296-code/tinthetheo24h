'use client';

import { useState, useEffect } from 'react';
import { getKeywords, addKeyword, deleteKeyword } from '../../../lib/actions/keyword-actions';

export default function AdminKeywords() {
    const [keywords, setKeywords] = useState<any[]>([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadKeywords();
    }, []);

    const loadKeywords = async () => {
        setLoading(true);
        const data = await getKeywords();
        setKeywords(data);
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!newKeyword || !newUrl) return;
        const res = await addKeyword(newKeyword, newUrl);
        if (res.success) {
            setNewKeyword('');
            setNewUrl('');
            loadKeywords();
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa từ khóa này?')) {
            const res = await deleteKeyword(id);
            if (res.success) {
                loadKeywords();
            }
        }
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Quản lý Từ khóa SEO</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
                <div className="admin-card">
                    <h3>Danh sách Từ khóa Mapping</h3>
                    {loading ? (
                        <p>Đang tải...</p>
                    ) : (
                        <table className="wp-table">
                            <thead>
                                <tr>
                                    <th>Từ khóa</th>
                                    <th>URL Đích</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keywords.length === 0 ? (
                                    <tr><td colSpan={3} style={{ textAlign: 'center' }}>Chưa có từ khóa nào.</td></tr>
                                ) : (
                                    keywords.map((kw) => (
                                        <tr key={kw._id}>
                                            <td style={{ fontWeight: '600' }}>{kw.keyword}</td>
                                            <td style={{ color: '#666', fontSize: '0.75rem' }}>{kw.url}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(kw._id)}
                                                    style={{ color: '#d63638', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="admin-card">
                    <h3>Thêm Từ khóa Mới</h3>
                    <div className="admin-form-group">
                        <label>Từ khóa (Keyword)</label>
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="Ví dụ: Manchester United"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>URL Đích</label>
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="Ví dụ: /clb/manchester-united"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                        />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#666', margin: '1rem 0' }}>
                        Hệ thống sẽ tự động quét và chèn link vào các bài viết có chứa từ khóa này.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={handleAdd}
                    >
                        Lưu từ khóa
                    </button>
                </div>
            </div>
        </div>
    );
}
