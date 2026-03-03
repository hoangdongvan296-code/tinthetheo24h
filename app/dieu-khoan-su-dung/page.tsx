import Header from '../../components/Header';
import React from 'react';

export default function DieuKhoanSuDung() {
    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '800px', margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h1 style={{ marginBottom: '2rem', borderBottom: '2px solid #ffd700', paddingBottom: '1rem' }}>Điều khoản sử dụng</h1>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>1. Chấp nhận các điều khoản</h2>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>Bằng việc truy cập và sử dụng dịch vụ của Bongda 2026 Auto, bạn đồng ý tuân thủ các điều khoản sử dụng này. Nếu bạn không đồng ý với một phần hoặc toàn bộ các điều khoản, xin vui lòng ngừng truy cập trang web ngay lập tức.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>2. Bản quyền nội dung</h2>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>Tất cả nội dung bao gồm bài viết, hình ảnh, mã nguồn và thiết kế giao diện đều thuộc bản quyền của Bongda 2026 Auto hoặc được sử dụng với sự cho phép của tác giả. Mọi hành vi sao chép cần ghi nguồn xuất xứ rõ ràng.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>3. Hành vi người dùng</h2>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>Người dùng không được phép có các hành vi phá hoại, gửi thư rác, tấn công từ chối dịch vụ (DDoS), hoặc đăng tải các thông tin không phù hợp, trái với thuần phong mỹ tục hoặc luật pháp Việt Nam. Chúng tôi có quyền từ chối cung cấp dịch vụ cho các tài khoản vi phạm.</p>
                </section>
            </main>
        </div>
    );
}
