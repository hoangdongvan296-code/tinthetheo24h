"use client";

import { useState } from 'react';

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1rem', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#333', fontSize: '0.9rem'
};

export default function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        const subject = encodeURIComponent(form.subject || 'Liên hệ từ tinthethao24h.com');
        const body = encodeURIComponent(`Họ tên: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
        window.location.href = `mailto:info@tinthethao24h.com?subject=${subject}&body=${body}`;
        setTimeout(() => setStatus('success'), 500);
    };

    if (status === 'success') {
        return (
            <div style={{ background: '#d4edda', padding: '2rem', borderRadius: '10px', textAlign: 'center', color: '#155724' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Đang mở ứng dụng email của bạn...</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#333' }}>
                    Hoặc gửi trực tiếp tới <strong>info@tinthethao24h.com</strong>
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Họ và tên *</label>
                    <input required name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Nguyễn Văn A" />
                </div>
                <div>
                    <label style={labelStyle}>Email *</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="email@example.com" />
                </div>
            </div>
            <div>
                <label style={labelStyle}>Chủ đề</label>
                <select name="subject" value={form.subject} onChange={handleChange} style={{ ...inputStyle, background: '#fff' }}>
                    <option value="">— Chọn chủ đề —</option>
                    <option value="Góp ý về nội dung">Góp ý về nội dung</option>
                    <option value="Báo lỗi kỹ thuật">Báo lỗi kỹ thuật</option>
                    <option value="Khiếu nại bản quyền">Khiếu nại bản quyền</option>
                    <option value="Hợp tác quảng cáo">Hợp tác quảng cáo</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>
            <div>
                <label style={labelStyle}>Nội dung *</label>
                <textarea required name="message" value={form.message} onChange={handleChange} rows={5} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Nhập nội dung tin nhắn của bạn..." />
            </div>
            <button
                type="submit"
                disabled={status === 'sending'}
                style={{ background: '#FFD700', color: '#000', padding: '0.9rem', borderRadius: '8px', border: 'none', fontWeight: '800', fontSize: '1rem', cursor: 'pointer' }}
            >
                {status === 'sending' ? '⏳ Đang xử lý...' : '📩 Gửi tin nhắn'}
            </button>
        </form>
    );
}
