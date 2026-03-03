"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAuthor, updateAuthor } from '@/lib/actions/author-actions';

interface AuthorFormProps {
    initialData?: {
        _id?: string;
        name?: string;
        role?: string;
        bio?: string;
        avatar?: string;
        experience?: number;
        specialties?: string[];
        social?: { facebook?: string; twitter?: string };
        isActive?: boolean;
    };
    mode: 'create' | 'edit';
}

export default function AuthorForm({ initialData, mode }: AuthorFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [specialtyInput, setSpecialtyInput] = useState('');

    const [form, setForm] = useState({
        name: initialData?.name || '',
        role: initialData?.role || '',
        bio: initialData?.bio || '',
        avatar: initialData?.avatar || '/author-avatar.png',
        experience: initialData?.experience ?? 1,
        specialties: initialData?.specialties || ([] as string[]),
        social: { facebook: initialData?.social?.facebook || '', twitter: initialData?.social?.twitter || '' },
        isActive: initialData?.isActive ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (name.startsWith('social.')) {
            setForm(prev => ({ ...prev, social: { ...prev.social, [name.slice(7)]: value } }));
        } else {
            setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
        }
    };

    const addSpecialty = () => {
        const trimmed = specialtyInput.trim();
        if (trimmed && !form.specialties.includes(trimmed)) {
            setForm(prev => ({ ...prev, specialties: [...prev.specialties, trimmed] }));
        }
        setSpecialtyInput('');
    };

    const removeSpecialty = (s: string) => {
        setForm(prev => ({ ...prev, specialties: prev.specialties.filter(x => x !== s) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.role.trim()) {
            setMsg({ type: 'error', text: 'Vui lòng nhập tên và chức danh' });
            return;
        }
        setSaving(true);
        setMsg(null);
        const data = { ...form };
        const res = mode === 'create'
            ? await createAuthor(data)
            : await updateAuthor(initialData!._id!, data);

        if (res.success) {
            setMsg({ type: 'success', text: mode === 'create' ? '✅ Tạo tác giả thành công!' : '✅ Đã lưu thay đổi!' });
            setTimeout(() => router.push('/admin/authors'), 1200);
        } else {
            setMsg({ type: 'error', text: (res as any).error || 'Lỗi không xác định' });
        }
        setSaving(false);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.75rem 1rem', border: '1px solid #ddd',
        borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box',
    };
    const labelStyle: React.CSSProperties = {
        display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.88rem', color: '#333',
    };
    const sectionStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #eee', marginBottom: '1.2rem',
    };

    return (
        <form onSubmit={handleSubmit}>
            {msg && (
                <div style={{ padding: '0.9rem 1.2rem', borderRadius: '8px', marginBottom: '1rem', background: msg.type === 'success' ? '#d4edda' : '#f8d7da', color: msg.type === 'success' ? '#155724' : '#721c24', fontWeight: '600' }}>
                    {msg.text}
                </div>
            )}

            {/* Basic Info */}
            <div style={sectionStyle}>
                <h3 style={{ margin: '0 0 1.2rem', fontWeight: '800', fontSize: '1rem', borderLeft: '4px solid #FFD700', paddingLeft: '0.75rem' }}>Thông tin cơ bản</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Tên tác giả *</label>
                        <input required name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                        <label style={labelStyle}>Chức danh *</label>
                        <input required name="role" value={form.role} onChange={handleChange} style={inputStyle} placeholder="Biên tập viên thể thao" />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={labelStyle}>URL ảnh đại diện</label>
                        <input name="avatar" value={form.avatar} onChange={handleChange} style={inputStyle} placeholder="/author-avatar.png hoặc https://..." />
                    </div>
                    <div>
                        {form.avatar && (
                            <img src={form.avatar} alt="preview" onError={e => (e.currentTarget.style.display = 'none')}
                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFD700' }} />
                        )}
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Số năm kinh nghiệm</label>
                    <input type="number" name="experience" value={form.experience} onChange={handleChange} min={0} max={50} style={{ ...inputStyle, width: '140px' }} />
                </div>
                <div>
                    <label style={labelStyle}>Giới thiệu (Bio)</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Giới thiệu ngắn về tác giả..." />
                </div>
            </div>

            {/* Specialties */}
            <div style={sectionStyle}>
                <h3 style={{ margin: '0 0 1rem', fontWeight: '800', fontSize: '1rem', borderLeft: '4px solid #FFD700', paddingLeft: '0.75rem' }}>Chuyên môn</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <input
                        value={specialtyInput}
                        onChange={e => setSpecialtyInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSpecialty(); } }}
                        style={{ ...inputStyle, flex: 1 }} placeholder="VD: Ngoại hạng Anh (Enter để thêm)" />
                    <button type="button" onClick={addSpecialty}
                        style={{ background: '#000', color: '#FFD700', border: 'none', padding: '0 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                        + Thêm
                    </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {form.specialties.map(s => (
                        <span key={s} style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                            {s}
                            <button type="button" onClick={() => removeSpecialty(s)}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc3545', fontWeight: '900', fontSize: '1rem', lineHeight: 1, padding: 0 }}>×</button>
                        </span>
                    ))}
                    {form.specialties.length === 0 && <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Chưa có chuyên môn nào</span>}
                </div>
            </div>

            {/* Social & Status */}
            <div style={sectionStyle}>
                <h3 style={{ margin: '0 0 1rem', fontWeight: '800', fontSize: '1rem', borderLeft: '4px solid #FFD700', paddingLeft: '0.75rem' }}>Mạng xã hội & Trạng thái</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Facebook URL</label>
                        <input name="social.facebook" value={form.social.facebook} onChange={handleChange} style={inputStyle} placeholder="https://facebook.com/..." />
                    </div>
                    <div>
                        <label style={labelStyle}>Twitter / X URL</label>
                        <input name="social.twitter" value={form.social.twitter} onChange={handleChange} style={inputStyle} placeholder="https://twitter.com/..." />
                    </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Đang hoạt động (sẽ được gán bài viết)</span>
                </label>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" disabled={saving}
                    style={{ background: '#FFD700', color: '#000', padding: '0.85rem 2rem', borderRadius: '8px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '1rem' }}>
                    {saving ? '⏳ Đang lưu...' : mode === 'create' ? '✅ Tạo tác giả' : '💾 Lưu thay đổi'}
                </button>
                <button type="button" onClick={() => router.push('/admin/authors')}
                    style={{ background: '#fff', color: '#333', padding: '0.85rem 2rem', borderRadius: '8px', border: '1px solid #ddd', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' }}>
                    Hủy
                </button>
            </div>
        </form>
    );
}
