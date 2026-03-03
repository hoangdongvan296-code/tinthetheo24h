import Link from 'next/link';
import './admin.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    TIN THỂ THAO 24H ADMIN
                </div>
                <nav>
                    <ul className="admin-nav">
                        <li className="admin-nav-item">
                            <Link href="/admin">Dashboard</Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link href="/admin/posts">Bài viết (Posts)</Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link href="/admin/media">📁 Kho Media</Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link href="/admin/authors">👤 Tác giả</Link>
                        </li>

                        <li className="admin-nav-item">
                            <Link href="/admin/videos">Quản lý Video</Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link href="/admin/crawler">Crawler &amp; Logs</Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link href="/admin/keywords">Keywords (SEO)</Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link href="/admin/adsense">💰 AdSense</Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link href="/admin/settings">Cài đặt chung</Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link href="/admin/password">🔐 Đổi mật khẩu</Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link href="/">Quay lại Web</Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
