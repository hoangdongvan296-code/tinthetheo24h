import PasswordForm from './PasswordForm';

export const metadata = {
    title: 'Đổi mật khẩu Admin | Tin Thể Thao 24h',
};

export default function AdminPasswordPage() {
    const currentUser = process.env.ADMIN_USERNAME || 'admin';

    return (
        <div style={{ maxWidth: '520px', margin: '2rem auto', padding: '0 1rem' }}>
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                {/* Header */}
                <div style={{ padding: '1.75rem 2rem', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔐</div>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#111', marginBottom: '0.25rem' }}>
                        Đổi mật khẩu quản trị
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Tài khoản hiện tại: <strong style={{ color: '#111' }}>{currentUser}</strong>
                    </p>
                </div>

                {/* Form */}
                <div style={{ padding: '2rem' }}>
                    <PasswordForm />
                </div>

                {/* Info box */}
                <div style={{ padding: '1rem 2rem 1.5rem' }}>
                    <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '0.85rem 1rem', border: '1px solid #bfdbfe' }}>
                        <p style={{ color: '#1e40af', fontSize: '0.8rem', lineHeight: '1.6', margin: 0 }}>
                            <strong>ℹ️ Lưu ý:</strong> Sau khi đổi mật khẩu thành công, bạn cần <strong>restart server</strong> để mật khẩu mới có hiệu lực.
                            Trên Vercel, hãy cập nhật biến môi trường <code style={{ background: '#dbeafe', padding: '1px 5px', borderRadius: '3px' }}>ADMIN_PASSWORD</code> trong Project Settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
