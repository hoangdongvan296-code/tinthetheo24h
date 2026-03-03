import Header from '@/components/Header';
import { getAuthors } from '@/lib/actions/author-actions';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Tác giả & Đội ngũ biên tập | Tin Thể Thao 24h',
    description: 'Gặp gỡ đội ngũ biên tập và các tác giả chuyên gia của Tinthethao24h.com — những người đam mê bóng đá với nhiều năm kinh nghiệm.',
    alternates: { canonical: 'https://tinthethao24h.com/tac-gia' },
};

const SITE_URL = 'https://tinthethao24h.com';

export default async function TacGiaPage() {
    const allAuthors = await getAuthors(false);
    const editors = allAuthors.filter(a => a.isActive);

    const orgPersonSchema = {
        "@context": "https://schema.org",
        "@graph": editors.map(e => ({
            "@type": "Person",
            "@id": `${SITE_URL}/tac-gia#${e.name.replace(/\s/g, '-').toLowerCase()}`,
            "name": e.name,
            "jobTitle": e.role,
            "image": e.avatar?.startsWith('http') ? e.avatar : `${SITE_URL}${e.avatar}`,
            "worksFor": { "@type": "Organization", "name": "Tin Thể Thao 24h", "url": SITE_URL },
            "knowsAbout": e.specialties,
            "description": e.bio,
            "sameAs": [e.social?.facebook, e.social?.twitter].filter(Boolean),
        })),
    };

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgPersonSchema) }} />
            <Header />

            <main style={{ maxWidth: '880px', margin: '2rem auto', padding: '0 1rem 4rem' }}>

                {/* Hero */}
                <div style={{ background: 'linear-gradient(135deg, #000 60%, #1a1a2e)', color: '#fff', borderRadius: '20px', padding: '3rem 2.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '200px', height: '200px', background: '#FFD700', borderRadius: '50%', opacity: 0.07 }} />
                    <span style={{ background: '#FFD700', color: '#000', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px' }}>ĐỘI NGŨ BIÊN TẬP</span>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '1rem 0 0.75rem', lineHeight: 1.2 }}>
                        Tác giả &<br />Chuyên gia biên tập
                    </h1>
                    <p style={{ color: '#bbb', maxWidth: '550px', lineHeight: 1.7, fontSize: '1rem' }}>
                        Đội ngũ biên tập của Tinthethao24h.com gồm các chuyên gia bóng đá với nhiều năm kinh nghiệm, cam kết mang đến thông tin chính xác và chuyên sâu nhất.
                    </p>
                    <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                        {[
                            [`${editors.length}`, 'Biên tập viên'],
                            ['50+', 'Bài viết/ngày'],
                            ['10+', 'Giải đấu'],
                            ['24/7', 'Cập nhật'],
                        ].map(([v, l]) => (
                            <div key={l}>
                                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFD700' }}>{v}</div>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '2px' }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor cards */}
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {editors.map((editor) => (
                        <div
                            key={editor._id}
                            itemScope itemType="https://schema.org/Person"
                            style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'auto 1fr', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                        >
                            <div style={{ background: '#000', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '160px' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px solid #FFD700', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                    <img src={editor.avatar || '/author-avatar.png'} alt={editor.name} itemProp="image"
                                        width={100} height={100} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ background: '#FFD700', color: '#000', padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900', textAlign: 'center' }}>
                                    {editor.experience} năm KN
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {editor.social?.facebook && (
                                        <a href={editor.social.facebook} target="_blank" rel="noopener noreferrer"
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', textDecoration: 'none' }}>f</a>
                                    )}
                                    {editor.social?.twitter && (
                                        <a href={editor.social.twitter} target="_blank" rel="noopener noreferrer"
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', textDecoration: 'none' }}>X</a>
                                    )}
                                </div>
                            </div>

                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div>
                                        <h2 itemProp="name" style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, color: '#000' }}>{editor.name}</h2>
                                        <p itemProp="jobTitle" style={{ color: '#FFD700', fontWeight: '700', fontSize: '0.9rem', margin: '0.2rem 0 0', background: '#000', display: 'inline-block', padding: '2px 10px', borderRadius: '4px' }}>
                                            {editor.role}
                                        </p>
                                    </div>
                                </div>
                                <p itemProp="description" style={{ color: '#555', lineHeight: 1.75, fontSize: '0.95rem', margin: '0.75rem 0 1rem' }}>
                                    {editor.bio}
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#666', marginRight: '0.3rem' }}>Chuyên môn:</span>
                                    {editor.specialties?.map(s => (
                                        <span key={s} itemProp="knowsAbout" style={{ background: '#f0f0f0', color: '#333', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editorial process */}
                <div style={{ marginTop: '2rem', background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #eee' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '800', borderLeft: '5px solid #FFD700', paddingLeft: '1rem', marginBottom: '1.2rem' }}>📋 Quy trình biên tập</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { step: '1', title: 'Thu thập', desc: 'AI tự động thu thập tin mới từ BBC Sport, Sky Sports, ESPN và các nguồn uy tín mỗi 15 phút.' },
                            { step: '2', title: 'Dịch & Biên tập', desc: 'Nội dung được dịch sang tiếng Việt và tối ưu bởi hệ thống AI ngôn ngữ tiên tiến.' },
                            { step: '3', title: 'Kiểm duyệt', desc: 'Biên tập viên xem lại nội dung để đảm bảo độ chính xác và phù hợp văn hóa Việt Nam.' },
                            { step: '4', title: 'Xuất bản', desc: 'Bài viết được đăng kèm SEO đầy đủ, ảnh minh họa và phân loại chuyên mục rõ ràng.' },
                        ].map(item => (
                            <div key={item.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FFD700', color: '#000', fontWeight: '900', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {item.step}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{item.title}</div>
                                    <div style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div style={{ marginTop: '1.5rem', background: '#000', color: '#fff', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 1rem', color: '#aaa' }}>Bạn muốn cộng tác hoặc đóng góp bài viết?</p>
                    <Link href="/lien-he" style={{ display: 'inline-block', background: '#FFD700', color: '#000', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: '900', textDecoration: 'none', fontSize: '0.95rem' }}>
                        📩 Liên hệ ngay
                    </Link>
                </div>

            </main>
        </div>
    );
}
