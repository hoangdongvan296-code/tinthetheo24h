import Header from '../../components/Header';
import VideoSection from '../../components/VideoSection';
import { getVideos } from '../../lib/actions/video-actions';

export const metadata = {
    title: 'Video Highlight Bóng Đá | Bàn Thắng Đẹp Mới Nhất',
    description: 'Xem video highlight bóng đá, tổng hợp bàn thắng đẹp từ các giải đấu hàng đầu thế giới: Ngoại hạng Anh, Cup C1, La Liga mới nhất.',
};



export const revalidate = 3600; // revalidate every hour

export default async function VideoPage() {
    const formattedVideos = await getVideos(30);

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
                <div className="video-detail-container" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #eee' }}>
                    <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
                        Tự động tổng hợp và cập nhật liên tục các Video Highlight, Bàn thắng đẹp nhất từ các giải đấu hàng đầu Châu Âu.
                    </p>
                    {formattedVideos.length === 0 ? (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>Đang tải video mới nhất từ hệ thống...</p>
                    ) : (
                        <VideoSection videos={formattedVideos} />
                    )}
                </div>
            </main>
        </div>
    );
}
