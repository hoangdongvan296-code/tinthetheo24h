import Header from '../../components/Header';
import React from 'react';

export default function ChinhSachBaoMat() {
    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '800px', margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h1 style={{ marginBottom: '2rem', borderBottom: '2px solid #ffd700', paddingBottom: '1rem' }}>Chính sách bảo mật</h1>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>1. Thu thập thông tin</h2>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>Chúng tôi không thu thập thông tin cá nhân của người dùng ngoại trừ những thông tin cơ bản liên quan đến phiên truy cập, nhằm cải thiện trải nghiệm trên website. Khi bạn tương tác với trang, chúng tôi có thể lưu trữ cookie ẩn danh.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>2. Sử dụng thông tin</h2>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>Các thông tin thu thập được dùng để phân tích hành vi người dùng, tối ưu hóa giao diện và cung cấp nội dung phù hợp nhất. Chúng tôi cam kết không bán hoặc chia sẻ dữ liệu với bên thứ ba cho mục đích thương mại.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>3. Bảo mật dữ liệu</h2>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>Chúng tôi áp dụng các biện pháp bảo mật hiện đại nhằm bảo vệ hệ thống khỏi các truy cập trái phép. Mọi thông tin truyền tải đều được mã hóa bằng giao thức an toàn.</p>
                </section>
            </main>
        </div>
    );
}
