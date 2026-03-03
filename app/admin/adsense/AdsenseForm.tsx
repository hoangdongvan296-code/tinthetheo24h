"use client";

import { useState } from 'react';
import { updateSettings } from '@/lib/actions/settings-actions';

interface AdsenseFormProps {
    initialData: {
        adsensePublisherId: string;
        adsenseEnabled: boolean;
        adsenseSlotHeader: string;
        adsenseSlotInArticle: string;
        adsenseSlotSidebar: string;
        adsenseSlotFooter: string;
    };
}

const sectionStyle = { borderLeft: '4px solid #FFD700', paddingLeft: '1rem', marginBottom: '1rem', fontWeight: 'bold' as const, fontSize: '1.1rem', color: '#000' };
const labelStyle = { display: 'block', marginBottom: '0.4rem', fontWeight: '600' as const, color: '#333', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' as const };
const hintStyle = { color: '#888', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' };
const dividerStyle = { border: 'none', borderTop: '2px solid #f0f0f0', margin: '1.5rem 0' };

export default function AdsenseForm({ initialData }: AdsenseFormProps) {
    const [formData, setFormData] = useState(initialData);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        const result = await updateSettings(formData);
        setStatus(result.success
            ? { type: 'success', message: '✅ Cập nhật cấu hình AdSense thành công!' }
            : { type: 'error', message: result.error || '❌ Có lỗi xảy ra khi lưu.' }
        );
        setIsSubmitting(false);
    };

    const previewCode = formData.adsensePublisherId ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formData.adsensePublisherId}" crossorigin="anonymous"></script>` : '';

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            {status.message && (
                <div style={{
                    padding: '1rem', borderRadius: '6px',
                    backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: status.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${status.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    {status.message}
                </div>
            )}

            {/* === BẬT / TẮT === */}
            <div style={{ background: '#fffbef', border: '1px solid #ffeeba', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                    type="checkbox"
                    name="adsenseEnabled"
                    id="adsenseEnabled"
                    checked={formData.adsenseEnabled}
                    onChange={handleChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#FFD700' }}
                />
                <label htmlFor="adsenseEnabled" style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', margin: 0 }}>
                    Bật hiển thị quảng cáo AdSense trên website
                </label>
            </div>

            {/* === PUBLISHER ID === */}
            <p style={sectionStyle}>🔑 Thông tin tài khoản AdSense</p>

            <div>
                <label style={labelStyle}>Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)</label>
                <input
                    type="text"
                    name="adsensePublisherId"
                    value={formData.adsensePublisherId}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="ca-pub-0000000000000000"
                />
                <small style={hintStyle}>
                    Tìm Publisher ID trong Google AdSense → Tài khoản → Thông tin tài khoản. Bắt đầu bằng <code>ca-pub-</code>.
                </small>
            </div>

            {previewCode && (
                <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>📋 Script AdSense sẽ được chèn vào &lt;head&gt;:</p>
                    <code style={{ fontSize: '0.8rem', color: '#d63384', wordBreak: 'break-all' as const }}>{previewCode}</code>
                </div>
            )}

            <hr style={dividerStyle} />

            {/* === SLOT IDs === */}
            <p style={sectionStyle}>📍 Vị trí quảng cáo (Ad Slots)</p>
            <p style={{ ...hintStyle, color: '#555', marginBottom: '0.5rem' }}>
                Mỗi vị trí quảng cáo cần một Slot ID riêng. Tạo Slot ID trong AdSense → Quảng cáo → Đơn vị quảng cáo → Theo đơn vị quảng cáo.
            </p>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                    <label style={labelStyle}>📌 Slot ID — Đầu trang (Header)</label>
                    <input
                        type="text"
                        name="adsenseSlotHeader"
                        value={formData.adsenseSlotHeader}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="Ví dụ: 1234567890"
                    />
                    <small style={hintStyle}>Banner ngang phía trên, ngay dưới menu.</small>
                </div>

                <div>
                    <label style={labelStyle}>📖 Slot ID — Trong bài viết (In-Article)</label>
                    <input
                        type="text"
                        name="adsenseSlotInArticle"
                        value={formData.adsenseSlotInArticle}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="Ví dụ: 0987654321"
                    />
                    <small style={hintStyle}>Ad chèn giữa nội dung bài viết hoặc video.</small>
                </div>

                <div>
                    <label style={labelStyle}>📊 Slot ID — Thanh bên (Sidebar)</label>
                    <input
                        type="text"
                        name="adsenseSlotSidebar"
                        value={formData.adsenseSlotSidebar}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="Ví dụ: 1122334455"
                    />
                    <small style={hintStyle}>Hiển thị trong cột sidebar bên phải.</small>
                </div>

                <div>
                    <label style={labelStyle}>🔽 Slot ID — Cuối trang (Footer)</label>
                    <input
                        type="text"
                        name="adsenseSlotFooter"
                        value={formData.adsenseSlotFooter}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="Ví dụ: 5544332211"
                    />
                    <small style={hintStyle}>Banner ngang phía dưới trang.</small>
                </div>
            </div>

            <hr style={dividerStyle} />

            {/* === HƯỚNG DẪN === */}
            <div style={{ background: '#e8f4fd', border: '1px solid #b8daff', borderRadius: '8px', padding: '1.25rem' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.75rem', color: '#004085' }}>📖 Hướng dẫn kết nối AdSense</p>
                <ol style={{ paddingLeft: '1.5rem', color: '#004085', lineHeight: '1.9', fontSize: '0.9rem' }}>
                    <li>Đăng nhập vào <strong>Google AdSense</strong> (adsense.google.com).</li>
                    <li>Vào <strong>Tài khoản → Thông tin tài khoản</strong> để copy <strong>Publisher ID</strong>.</li>
                    <li>Vào <strong>Quảng cáo → Đơn vị quảng cáo → Theo đơn vị quảng cáo</strong> → Tạo đơn vị mới.</li>
                    <li>Chọn loại quảng cáo phù hợp cho từng vị trí → Copy <strong>Slot ID</strong> (dãy số trong data-ad-slot).</li>
                    <li>Nhập thông tin vào các ô bên trên và nhấn <strong>Lưu Thay Đổi</strong>.</li>
                    <li>Script AdSense sẽ được tự động thêm vào <code>&lt;head&gt;</code> và hiển thị quảng cáo theo vị trí đã cấu hình.</li>
                </ol>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '2px solid #f0f0f0' }}>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: '0.9rem 2.5rem',
                        backgroundColor: isSubmitting ? '#999' : '#000',
                        color: '#FFD700',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    {isSubmitting ? '⏳ Đang lưu...' : '💾 Lưu Thay Đổi'}
                </button>
            </div>
        </form>
    );
}
