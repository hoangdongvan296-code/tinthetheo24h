'use client';

import { useState, useEffect } from 'react';

interface LogEntry {
    _id?: string;
    time?: string;
    createdAt?: string;
    message: string;
    type: string;
}

export default function AdminCrawler() {
    const [isCrawling, setIsCrawling] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([
        { time: new Date().toLocaleTimeString('vi-VN'), message: 'Bảng điều khiển kết nối máy chủ...', type: 'info' }
    ]);

    const fetchStatusAndLogs = async () => {
        try {
            const [statusRes, logsRes] = await Promise.all([
                fetch('/api/admin/crawler/start', { cache: 'no-store' }),
                fetch('/api/admin/crawler/logs', { cache: 'no-store' })
            ]);

            if (statusRes.ok) {
                const statusData = await statusRes.json();
                setIsCrawling(statusData.isCrawling);
            }

            if (logsRes.ok) {
                const logsData = await logsRes.json();
                if (logsData.logs && logsData.logs.length > 0) {
                    setLogs(logsData.logs.map((L: any) => ({
                        time: new Date(L.createdAt).toLocaleTimeString('vi-VN'),
                        message: L.message,
                        type: L.type
                    })));
                } else {
                    setLogs([{ time: new Date().toLocaleTimeString('vi-VN'), message: 'Chưa có dữ liệu log lịch sử.', type: 'info' }]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch crawler data", error);
        }
    };

    useEffect(() => {
        fetchStatusAndLogs();
        const interval = setInterval(fetchStatusAndLogs, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const startCrawl = async () => {
        setIsCrawling(true);
        try {
            await fetch('/api/admin/crawler/start', {
                method: 'POST'
            });
            // Logs will update via the polling interval
        } catch (error) {
            console.error(error);
            setIsCrawling(false);
        }
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Bảng điều khiển Crawler</h1>
                <button
                    className="btn-primary"
                    onClick={startCrawl}
                    disabled={isCrawling}
                    style={{ background: isCrawling ? '#888' : '#2271b1' }}
                >
                    {isCrawling ? 'Đang chạy cào dữ liệu...' : 'Bắt đầu cào tin mới'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="admin-card">
                    <h3>Trạng thái hiện tại</h3>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: isCrawling ? '100%' : '0%', transition: 'width 3s linear' }}></div>
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>
                        {isCrawling ? 'Hệ thống đang thu thập và dịch thuật nội dung (Xem Logs)...' : 'Hệ thống đã sẵn sàng xử lý yêu cầu.'}
                    </p>
                    <hr style={{ margin: '1.5rem 0', opacity: 0.1 }} />
                    <div style={{ fontSize: '0.85rem' }}>
                        <div><strong>Nguồn tin:</strong> Tribal Football, thethao247</div>
                        <div><strong>Model AI:</strong> Google Gemini 2.0 Flash / OpenRouter</div>
                        <div><strong>Tự động hóa:</strong> Chờ cấu hình Cron (hoạt động ngầm)</div>
                    </div>
                </div>

                <div className="admin-card">
                    <h3>Hành động nhanh</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button className="btn-primary" style={{ background: '#eee', color: '#333', borderColor: '#ccc' }}>Cập nhật tỉ số trực tiếp</button>
                        <button className="btn-primary" style={{ background: '#eee', color: '#333', borderColor: '#ccc' }}>Xóa bộ nhớ đệm (Cache)</button>
                        <button className="btn-primary" style={{ background: '#eee', color: '#333', borderColor: '#ccc' }}>Tạo lại Sitemap</button>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <h3>Hoạt động trực tiếp (Live Logs)</h3>
                <div className="log-container" style={{ background: '#1e1e1e', color: '#00ff00', padding: '1rem', borderRadius: '8px', height: '300px', overflowY: 'auto', fontFamily: 'monospace' }}>
                    {logs.map((log, i) => (
                        <div key={i} className="log-entry" style={{ marginBottom: '5px' }}>
                            <span className="log-time" style={{ color: '#888', marginRight: '10px' }}>[{log.time}]</span>
                            <span className={`log-status-${log.type}`} style={{ color: log.type === 'error' ? '#ff4c4c' : log.type === 'warn' ? '#f1c40f' : '#00ff00' }}>{log.message}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
