"use client";

import React, { useEffect, useState } from 'react';
import { getVideos, deleteVideo } from '../../../lib/actions/video-actions';

export default function AdminVideosPage() {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        const data = await getVideos(100);
        setVideos(data);
        setLoading(false);
    };

    const handleDelete = async (videoId: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa video này?')) {
            const res = await deleteVideo(videoId);
            if (res.success) {
                setVideos(videos.filter(v => v.videoId !== videoId));
            } else {
                alert('Có lỗi xảy ra khi xóa video.');
            }
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Quản lý Video</h1>

            {loading ? (
                <p>Đang tải danh sách video...</p>
            ) : (
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8f9fa' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Thumbnail</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Tiêu đề</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Kênh/Giải</th>
                                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                        Chưa có video nào trong hệ thống.
                                    </td>
                                </tr>
                            ) : (
                                videos.map((vid) => (
                                    <tr key={vid.videoId} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <img src={vid.thumbnail} alt="" style={{ width: '120px', borderRadius: '4px' }} />
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{vid.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{vid.videoId}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                                {vid.league}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDelete(vid.videoId)}
                                                style={{ background: '#ff4d4f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
