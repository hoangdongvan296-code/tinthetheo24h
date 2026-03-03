import Link from 'next/link';
import React from 'react';
import { getSettings } from '@/lib/actions/settings-actions';

export default async function Footer() {
    const settings = await getSettings();

    return (
        <footer style={{ backgroundColor: '#000', color: '#fff', padding: '3rem 0', marginTop: '4rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                    <div>
                        <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Về chúng tôi</h3>
                        <p style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: settings.footerAbout.replace(/\n/g, '<br/>') }} />
                    </div>
                    <div>
                        <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Giải đấu</h3>
                        <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#ccc', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><Link href="/ngoai-hang-anh" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Ngoại hạng Anh</Link></li>
                            <li><Link href="/champions-league" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Champions League</Link></li>
                            <li><Link href="/la-liga" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">La Liga</Link></li>
                            <li><Link href="/world-cup-2026" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">World Cup 2026</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Chuyên mục</h3>
                        <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#ccc', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><Link href="/tin-tuc" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Tin mới nhất</Link></li>
                            <li><Link href="/chuyen-nhuong" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Chuyển nhượng</Link></li>
                            <li><Link href="/lich-thi-dau" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Lịch thi đấu</Link></li>
                            <li><Link href="/video" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Video Highlights</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Pháp lý & Liên hệ</h3>
                        <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#ccc', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><Link href="/ve-chung-toi" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Về chúng tôi</Link></li>
                            <li><Link href="/lien-he" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Liên hệ</Link></li>
                            <li><Link href="/tac-gia" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Tác giả</Link></li>
                            <li><Link href="/chinh-sach-bao-mat" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Chính sách bảo mật</Link></li>
                            <li><Link href="/dieu-khoan-su-dung" style={{ color: '#ccc', textDecoration: 'none' }} className="footer-link">Điều khoản sử dụng</Link></li>
                            <li style={{ marginTop: '0.5rem' }}>Email: <a href={`mailto:${settings.footerEmail}`} style={{ color: '#ffd700', textDecoration: 'none' }}>{settings.footerEmail}</a></li>
                        </ul>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.8rem', borderTop: '1px solid #333', paddingTop: '1.5rem', color: '#888' }}>
                    &copy; 2024–2026 Tinthethao24h.com — Bảo lưu mọi quyền. Nội dung được tổng hợp từ nguồn quốc tế.
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .footer-link:hover {
                    color: #ffd700 !important;
                    text-decoration: underline !important;
                }
            `}} />
        </footer>
    );
}
