import Header from '@/components/Header';
import ContactForm from './ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Liên hệ | Tin Thể Thao 24h',
    description: 'Liên hệ với đội ngũ Tinthethao24h.com để góp ý, báo lỗi, khiếu nại bản quyền hoặc hợp tác quảng cáo.',
};

export default function LienHePage() {
    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '860px', margin: '2rem auto', padding: '0 1rem 4rem' }}>

                {/* Hero */}
                <div style={{ background: '#000', color: '#fff', borderRadius: '16px', padding: '2.5rem', marginBottom: '2rem' }}>
                    <span style={{ background: '#FFD700', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>LIÊN HỆ</span>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', marginTop: '1rem', marginBottom: '0.5rem' }}>Chúng tôi sẵn sàng lắng nghe</h1>
                    <p style={{ color: '#aaa' }}>Góp ý, hợp tác, báo lỗi hoặc khiếu nại bản quyền — liên hệ ngay với đội ngũ biên tập.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                    {/* Thông tin liên hệ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { icon: '📧', label: 'Email', value: 'info@tinthethao24h.com', href: 'mailto:info@tinthethao24h.com' },
                            { icon: '🌐', label: 'Website', value: 'tinthethao24h.com', href: 'https://tinthethao24h.com' },
                            { icon: '🕒', label: 'Giờ phản hồi', value: 'Trong vòng 24h', href: null },
                            { icon: '📋', label: 'Báo lỗi nội dung', value: 'Ghi rõ URL bài viết', href: null },
                        ].map((item) => (
                            <div key={item.label} style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #eee' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{item.icon}</div>
                                <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                                {item.href ? (
                                    <a href={item.href} style={{ fontWeight: '700', color: '#000', textDecoration: 'none', fontSize: '0.9rem', wordBreak: 'break-all' }}>{item.value}</a>
                                ) : (
                                    <div style={{ fontWeight: '700', color: '#333', fontSize: '0.9rem' }}>{item.value}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form liên hệ (client component) */}
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Gửi tin nhắn</h2>
                        <ContactForm />
                    </div>
                </div>

            </main>
        </div>
    );
}
