"use client";

import { useState } from 'react';
import { updateSettings } from '@/lib/actions/settings-actions';

interface SettingsFormProps {
    initialData: {
        logoText: string;
        logoUrl: string;
        faviconUrl: string;
        footerAbout: string;
        footerEmail: string;
        googleAnalyticsId: string;
        googleSiteVerification: string;
        defaultOgImage: string;
        twitterHandle: string;
        siteUrl: string;
        siteName: string;
        // Schema & SEO
        schemaLogo: string;
        brandName: string;
        brandSlogan: string;
        brandDescription: string;
        customHeaderCode: string;
        customBodyStartCode: string;
        customBodyEndCode: string;
    }
}

const sectionStyle = { borderLeft: '4px solid #FFD700', paddingLeft: '1rem', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem', color: '#000' };
const labelStyle = { display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' as const };
const hintStyle = { color: '#888', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' };
const dividerStyle = { border: 'none', borderTop: '2px solid #f0f0f0', margin: '1.5rem 0' };

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [formData, setFormData] = useState(initialData);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        const result = await updateSettings(formData);
        setStatus(result.success
            ? { type: 'success', message: '✅ Cập nhật cài đặt thành công! Trang sẽ tự làm mới.' }
            : { type: 'error', message: result.error || '❌ Có lỗi xảy ra khi lưu.' }
        );
        setIsSubmitting(false);
    };

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

            {/* === THƯƠNG HIỆU === */}
            <p style={sectionStyle}>🎨 Thương hiệu & Logo</p>

            <div>
                <label style={labelStyle}>Tên trang web (Site Name)</label>
                <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} style={inputStyle} placeholder="VD: Tin Thể Thao 24h" />
                <small style={hintStyle}>Hiển thị ở title, Schema.org, OpenGraph.</small>
            </div>

            <div>
                <label style={labelStyle}>Logo Text</label>
                <input type="text" name="logoText" value={formData.logoText} onChange={handleChange} style={inputStyle} placeholder="VD: Tin Thể Thao 24h" />
                <small style={hintStyle}>Hiển thị ở Header nếu không có Logo Image URL.</small>
            </div>

            <div>
                <label style={labelStyle}>Logo Image URL</label>
                <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} style={inputStyle} placeholder="VD: https://tinthethao24h.com/logo.png" />
            </div>

            <div>
                <label style={labelStyle}>Favicon URL</label>
                <input type="text" name="faviconUrl" value={formData.faviconUrl} onChange={handleChange} style={inputStyle} placeholder="VD: https://tinthethao24h.com/favicon.ico" />
                <small style={hintStyle}>Icon hiển thị trên tab trình duyệt. Hỗ trợ .ico, .png (khuyến nghị 32x32 hoặc 64x64)</small>
                {formData.faviconUrl && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={formData.faviconUrl} alt="Favicon preview" style={{ width: '32px', height: '32px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px', padding: '2px' }} />
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Preview</span>
                    </div>
                )}
            </div>

            <hr style={dividerStyle} />

            {/* === FOOTER === */}
            <p style={sectionStyle}>📝 Footer</p>

            <div>
                <label style={labelStyle}>Mô tả "Về chúng tôi"</label>
                <textarea name="footerAbout" value={formData.footerAbout} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div>
                <label style={labelStyle}>Email liên hệ</label>
                <input type="email" name="footerEmail" value={formData.footerEmail} onChange={handleChange} style={inputStyle} />
            </div>

            <hr style={dividerStyle} />

            {/* === SEO === */}
            <p style={sectionStyle}>🔍 SEO — Tối ưu tìm kiếm</p>

            <div>
                <label style={labelStyle}>Site URL (Domain đầy đủ)</label>
                <input type="text" name="siteUrl" value={formData.siteUrl} onChange={handleChange} style={inputStyle} placeholder="https://tinthethao24h.com" />
                <small style={hintStyle}>Dùng trong Canonical URL, Sitemap, và Schema.org.</small>
            </div>

            <div>
                <label style={labelStyle}>Ảnh OG mặc định (Default OG Image URL)</label>
                <input type="text" name="defaultOgImage" value={formData.defaultOgImage} onChange={handleChange} style={inputStyle} placeholder="https://tinthethao24h.com/og-default.png" />
                <small style={hintStyle}>Ảnh preview khi chia sẻ link trang chủ lên Facebook/Zalo.</small>
            </div>

            <div>
                <label style={labelStyle}>Twitter/X Handle</label>
                <input type="text" name="twitterHandle" value={formData.twitterHandle} onChange={handleChange} style={inputStyle} placeholder="@tinthethao24h" />
            </div>

            <div>
                <label style={labelStyle}>Google Analytics ID</label>
                <input type="text" name="googleAnalyticsId" value={formData.googleAnalyticsId} onChange={handleChange} style={inputStyle} placeholder="G-XXXXXXXXXX" />
                <small style={hintStyle}>Nhập ID Google Analytics 4. Để trống nếu chưa có.</small>
            </div>

            <div>
                <label style={labelStyle}>Google Search Console Verification Code</label>
                <input type="text" name="googleSiteVerification" value={formData.googleSiteVerification} onChange={handleChange} style={inputStyle} placeholder="Mã xác minh từ Google Search Console" />
                <small style={hintStyle}>Lấy từ Search Console &gt; Xác minh quyền sở hữu &gt; Meta tag. Chỉ nhập phần content="".</small>
            </div>

            <hr style={dividerStyle} />

            {/* === SCHEMA & BRANDING === */}
            <p style={sectionStyle}>🏗️ Schema.org & Branding Chi tiết</p>

            <div>
                <label style={labelStyle}>Tên thương hiệu (Brand Name - Dùng cho Schema)</label>
                <input type="text" name="brandName" value={formData.brandName} onChange={handleChange} style={inputStyle} placeholder="VD: Tin Thể Thao 24h" />
                <small style={hintStyle}>Dùng trong Organization Schema và NewsArticle Publisher.</small>
            </div>

            <div>
                <label style={labelStyle}>Slogan thương hiệu</label>
                <input type="text" name="brandSlogan" value={formData.brandSlogan} onChange={handleChange} style={inputStyle} placeholder="VD: Bóng đá, Thể thao cập nhật 24/7" />
            </div>

            <div>
                <label style={labelStyle}>Mô tả thương hiệu (Brand Description)</label>
                <textarea name="brandDescription" value={formData.brandDescription} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                <small style={hintStyle}>Đoạn văn giới thiệu ngắn về tổ chức cho Google Bot.</small>
            </div>

            <div>
                <label style={labelStyle}>Logo URL cho Schema (Khuyên dùng 600x60 px)</label>
                <input type="text" name="schemaLogo" value={formData.schemaLogo} onChange={handleChange} style={inputStyle} placeholder="https://tinthethao24h.com/logo-600x60.png" />
                <small style={hintStyle}>Google yêu cầu logo cho AMP/NewsArticle có chiều cao tối đa 60px.</small>
                {formData.schemaLogo && (
                    <div style={{ marginTop: '0.5rem', background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                        <img src={formData.schemaLogo} alt="Schema Logo preview" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                    </div>
                )}
            </div>

            <hr style={dividerStyle} />

            {/* === CUSTOM CODE SNIPPETS === */}
            <p style={sectionStyle}>💻 Mã nhúng tùy chỉnh (Header & Footer)</p>
            <p style={{ ...hintStyle, marginBottom: '1rem', color: '#555' }}>
                Cho phép bạn chèn thêm mã HTML, CSS hoặc Javascript vào các vị trí quan trọng trên website (như mã theo dõi Google Analytics, Facebook Pixel, Chat bot...).
            </p>

            <div>
                <label style={labelStyle}>Mã nhúng Header (Scripts in Header)</label>
                <textarea
                    name="customHeaderCode"
                    value={formData.customHeaderCode}
                    onChange={handleChange}
                    rows={6}
                    style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
                    placeholder="<script>...</script> hoặc <style>...</style>"
                />
                <small style={hintStyle}>Được chèn vào bên trong thẻ <code>&lt;head&gt;</code>.</small>
            </div>

            <div>
                <label style={labelStyle}>Mã nhúng đầu Body (Scripts in Body Top)</label>
                <textarea
                    name="customBodyStartCode"
                    value={formData.customBodyStartCode}
                    onChange={handleChange}
                    rows={6}
                    style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
                    placeholder="VD: Google Tag Manager (noscript)"
                />
                <small style={hintStyle}>Được chèn vào ngay sau thẻ mở <code>&lt;body&gt;</code>.</small>
            </div>

            <div>
                <label style={labelStyle}>Mã nhúng cuối Body (Scripts in Footer)</label>
                <textarea
                    name="customBodyEndCode"
                    value={formData.customBodyEndCode}
                    onChange={handleChange}
                    rows={6}
                    style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
                    placeholder="VD: Live Chat Widget, Custom Footer Scripts"
                />
                <small style={hintStyle}>Được chèn vào ngay trước thẻ đóng <code>&lt;/body&gt;</code>.</small>
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
