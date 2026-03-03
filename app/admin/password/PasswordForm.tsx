'use client';

import { useState } from 'react';

export default function PasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setResult(null);

        if (newPassword !== confirmPassword) {
            setResult({ success: false, message: 'Mật khẩu mới và xác nhận không khớp' });
            return;
        }
        if (newPassword.length < 6) {
            setResult({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newUsername, newPassword }),
            });
            const data = await res.json();
            setResult({ success: data.success, message: data.message || data.error });
            if (data.success) {
                setCurrentPassword('');
                setNewUsername('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch {
            setResult({ success: false, message: 'Lỗi kết nối server' });
        } finally {
            setLoading(false);
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1.5px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '1rem',
        color: '#111',
        background: '#fafafa',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    };
    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontWeight: '600',
        marginBottom: '0.4rem',
        color: '#374151',
        fontSize: '0.9rem',
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

            {/* Current password */}
            <div>
                <label style={labelStyle}>Mật khẩu hiện tại *</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        required
                        placeholder="Nhập mật khẩu hiện tại"
                        style={{ ...inputStyle, paddingRight: '3rem' }}
                    />
                    <button type="button" onClick={() => setShowCurrent(p => !p)}
                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1.1rem' }}>
                        {showCurrent ? '🙈' : '👁️'}
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '0.25rem' }} />

            {/* New username */}
            <div>
                <label style={labelStyle}>Tên đăng nhập mới <span style={{ color: '#9ca3af', fontWeight: '400' }}>(để trống giữ nguyên)</span></label>
                <input
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập mới (không bắt buộc)"
                    style={inputStyle}
                    autoComplete="username"
                />
            </div>

            {/* New password */}
            <div>
                <label style={labelStyle}>Mật khẩu mới *</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        placeholder="Ít nhất 6 ký tự"
                        style={{ ...inputStyle, paddingRight: '3rem' }}
                        autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowNew(p => !p)}
                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1.1rem' }}>
                        {showNew ? '🙈' : '👁️'}
                    </button>
                </div>
                {/* Strength indicator */}
                {newPassword && (
                    <div style={{ marginTop: '0.4rem', display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{
                                flex: 1, height: '4px', borderRadius: '2px',
                                background: newPassword.length >= i * 3
                                    ? (newPassword.length >= 12 ? '#22c55e' : newPassword.length >= 8 ? '#f59e0b' : '#ef4444')
                                    : '#e5e7eb'
                            }} />
                        ))}
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '4px' }}>
                            {newPassword.length < 6 ? 'Quá ngắn' : newPassword.length < 8 ? 'Yếu' : newPassword.length < 12 ? 'Trung bình' : 'Mạnh'}
                        </span>
                    </div>
                )}
            </div>

            {/* Confirm password */}
            <div>
                <label style={labelStyle}>Xác nhận mật khẩu mới *</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    style={{ ...inputStyle, borderColor: confirmPassword && confirmPassword !== newPassword ? '#ef4444' : confirmPassword && confirmPassword === newPassword ? '#22c55e' : '#e5e7eb' }}
                    autoComplete="new-password"
                />
                {confirmPassword && confirmPassword !== newPassword && (
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠ Mật khẩu xác nhận không khớp</p>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                    <p style={{ color: '#22c55e', fontSize: '0.8rem', marginTop: '0.25rem' }}>✓ Mật khẩu khớp</p>
                )}
            </div>

            {/* Result message */}
            {result && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    background: result.success ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${result.success ? '#bbf7d0' : '#fecaca'}`,
                    color: result.success ? '#166534' : '#991b1b',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                }}>
                    {result.success ? '✅' : '❌'} {result.message}
                    {result.success && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#166534', opacity: 0.8 }}>
                            💡 Mật khẩu mới có hiệu lực sau khi restart server
                        </div>
                    )}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '0.85rem',
                    background: loading ? '#9ca3af' : '#111',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                }}
            >
                {loading ? '⏳ Đang cập nhật...' : '🔐 Đổi mật khẩu'}
            </button>
        </form>
    );
}
