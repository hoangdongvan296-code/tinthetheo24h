import { getAdminStats } from '../../lib/actions/article-actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const statsData = await getAdminStats();

    const stats = [
        { label: 'Tổng bài viết', value: statsData.total.toString(), color: '#2271b1' },
        { label: 'Chờ duyệt (Draft)', value: statsData.draft.toString(), color: '#d63638' },
        { label: 'Đã xuất bản', value: statsData.published.toString(), color: '#00a32a' },
        { label: 'Cào mới hôm nay', value: '1', color: '#ffb900' }, // Hardcoded for now until we have local storage for today's count
    ];

    return (
        <div>
            <div className="admin-header">
                <h1>Bảng điều khiển (Dashboard)</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((stat) => (
                    <div key={stat.label} className="admin-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="admin-card">
                <h3>Hoạt động gần đây</h3>
                {statsData.recentActivity.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Chưa có hoạt động nào được ghi nhận. Hệ thống crawler sẽ cập nhật dữ liệu tại đây.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {statsData.recentActivity.map((act: any, i: number) => (
                            <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f1', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Đã cào bài: <strong>{act.originalTitle.substring(0, 60)}...</strong></span>
                                <span style={{ color: '#888' }}>{new Date(act.createdAt).toLocaleTimeString('vi-VN')}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="admin-card">
                <h3>Trạng thái Hệ thống</h3>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>AI Translation (OpenRouter):</strong> <span style={{ color: '#00a32a' }}>Online</span></li>
                    <li><strong>Crawler Engine:</strong> <span style={{ color: '#00a32a' }}>Sẵn sàng</span></li>
                    <li><strong>Database (MongoDB):</strong> <span style={{ color: '#00a32a' }}>Đã kết nối</span></li>
                </ul>
            </div>
        </div>
    );
}
