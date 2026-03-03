import Header from '../../components/Header';
import React from 'react';

export default function MienTruTrachNhiem() {
    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '800px', margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h1 style={{ marginBottom: '2rem', borderBottom: '2px solid #ffd700', paddingBottom: '1rem' }}>Miễn trừ trách nhiệm</h1>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>1. Tính chính xác của thông tin</h2>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>Tất cả thông tin, tin tức bóng đá và dữ liệu thống kê trên hệ thống Bongda 2026 Auto được thu thập tự động từ các nguồn bên ngoài và xử lý qua AI. Mặc dù chúng tôi nỗ lực cung cấp thông tin chính xác nhất, chúng tôi không đảm bảo tính hoàn thiện hay cập nhật thời gian thực tuyệt đối. Việc sử dụng, áp dụng những thông tin vào mục đích cá nhân, bao gồm nhưng không giới hạn vào cá cược, là quyết định của người dùng và bạn sẽ tự chịu trách nhiệm về quyết định của mình.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>2. Liên kết bên ngoài</h2>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>Bongda 2026 Auto có thể chứa liên kết tới các trang web bên ngoài với mục đích cung cấp thêm nội dung (ví dụ: video youtube). Chúng tôi không kiểm soát về nội dung hoặc chính sách của các trang web đến từ bên thứ 3 và do đó sẽ không chịu bất kỳ rủi ro hay tổn thất nào liên quan đến việc truy cập những đường dẫn này.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>3. Từ chối bảo hành</h2>
                    <p style={{ lineHeight: '1.6', color: '#444' }}>Dịch vụ được cung cấp "nguyên trạng". Hệ thống có thể gặp lỗi, sự cố bảo trì trong tương lai. Bongda 2026 Auto sẽ không chịu trách nhiệm và không bồi thường cho bất kỳ sự cố gián đoạn dịch vụ, mất dữ liệu, hoặc các tổn thất phát sinh liên đới do việc sử dụng trang web.</p>
                </section>
            </main>
        </div>
    );
}
