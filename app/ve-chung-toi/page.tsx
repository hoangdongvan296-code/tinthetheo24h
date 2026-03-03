import Header from '@/components/Header';
import Link from 'next/link';

export const metadata = {
    title: 'Về Chúng Tôi | Tin Thể Thao 24h',
    description: 'Tìm hiểu về Tinthethao24h.com - Hệ thống cập nhật tin tức bóng đá, thể thao hàng đầu Việt Nam. Đội ngũ biên tập, quy trình kiểm duyệt và sứ mệnh của chúng tôi.',
};

const SITE_URL = 'https://tinthethao24h.com';

export default function AboutPage() {
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Tin Thể Thao 24h",
        "url": SITE_URL,
        "logo": `${SITE_URL}/logo.png`,
        "foundingDate": "2024",
        "description": "Hệ thống cập nhật tin tức bóng đá, thể thao tự động từ các nguồn uy tín thế giới.",
        "email": "info@tinthethao24h.com",
        "contactPoint": { "@type": "ContactPoint", "contactType": "Editorial", "email": "info@tinthethao24h.com", "availableLanguage": "Vietnamese" },
        "sameAs": ["https://www.facebook.com/tinthethao24h"]
    };

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
            <Header />
            <main style={{ maxWidth: '860px', margin: '2rem auto', padding: '0 1rem' }}>

                {/* Hero */}
                <div style={{ background: '#000', color: '#fff', borderRadius: '16px', padding: '3rem 2.5rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: '#FFD700', borderRadius: '0 16px 0 200px', opacity: 0.15 }} />
                    <div style={{ position: 'relative' }}>
                        <span style={{ background: '#FFD700', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>VỀ CHÚNG TÔI</span>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '1rem', marginBottom: '1rem', lineHeight: 1.2 }}>Tin Thể Thao 24h</h1>
                        <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '600px' }}>
                            Hệ thống cập nhật tin tức bóng đá, thể thao tự động từ các nguồn uy tín hàng đầu thế giới. Nhanh chóng, chính xác và hoàn toàn bằng tiếng Việt.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Sứ mệnh */}
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ width: '48px', height: '48px', background: '#FFF9E6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.2rem' }}>🎯</div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.8rem' }}>Sứ mệnh</h2>
                        <p style={{ color: '#555', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            Mang đến cho người hâm mộ bóng đá Việt Nam những tin tức mới nhất, nhanh nhất từ các giải đấu hàng đầu châu Âu và thế giới — hoàn toàn bằng ngôn ngữ mẹ đẻ.
                        </p>
                    </div>

                    {/* Quy trình */}
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ width: '48px', height: '48px', background: '#FFF9E6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.2rem' }}>⚙️</div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.8rem' }}>Quy trình biên tập</h2>
                        <p style={{ color: '#555', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            Tin tức được thu thập từ các nguồn quốc tế uy tín (BBC Sport, Sky Sports, ESPN...), xử lý và biên tập bằng AI, sau đó được đội ngũ kiểm duyệt trước khi đăng tải.
                        </p>
                    </div>
                </div>

                {/* Nguồn tin */}
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', borderLeft: '5px solid #FFD700', paddingLeft: '1rem' }}>📰 Nguồn tin uy tín</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {['BBC Sport', 'Sky Sports', 'ESPN FC', 'The Guardian', 'Goal.com', 'UEFA.com', 'Tribal Football', 'Football Italia', 'Bundesliga.com'].map(source => (
                            <div key={source} style={{ background: '#f8f9fa', padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
                                {source}
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Disclaimer */}
                <div style={{ background: '#FFF9E6', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid #FFE066', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🤖 Chính sách sử dụng AI
                    </h3>
                    <p style={{ color: '#555', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
                        Tinthethao24h.com sử dụng công nghệ AI để <strong>tự động thu thập, dịch thuật và biên tập</strong> nội dung từ các nguồn quốc tế sang tiếng Việt. Tất cả nội dung đều được ghi rõ nguồn gốc và không nhằm mục đích vi phạm bản quyền. Nếu bạn là chủ sở hữu nội dung và có khiếu nại, vui lòng liên hệ <strong>info@tinthethao24h.com</strong>.
                    </p>
                </div>

                {/* Thống kê */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Bài viết / ngày', value: '50+' },
                        { label: 'Giải đấu theo dõi', value: '10+' },
                        { label: 'Cập nhật liên tục', value: '24/7' },
                    ].map((stat) => (
                        <div key={stat.label} style={{ background: '#000', color: '#fff', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FFD700' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.3rem' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Liên hệ CTA */}
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.8rem' }}>Có câu hỏi hoặc góp ý?</h2>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>Chúng tôi luôn sẵn sàng lắng nghe từ độc giả.</p>
                    <Link href="/lien-he" style={{ display: 'inline-block', background: '#FFD700', color: '#000', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
                        📩 Liên hệ ngay
                    </Link>
                </div>

            </main>
        </div>
    );
}
