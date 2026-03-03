export const AUTHORS = [
    {
        id: 'anh-tu',
        name: 'Anh Tú',
        role: 'Chủ biên Thể thao',
        bio: 'Biên tập viên với hơn 10 năm kinh nghiệm theo dõi bóng đá quốc tế, đặc biệt là tin tức chuyển nhượng tại Anh và Tây Ban Nha.',
        avatar: '/authors/anh-tu.webp',
    },
    {
        id: 'minh-quan',
        name: 'Minh Quân',
        role: 'Chuyên gia soi kèo',
        bio: 'Chuyên gia phân tích dữ liệu và nhận định bóng đá, từng làm việc cho nhiều trang báo lớn tại Việt Nam.',
        avatar: '/authors/minh-quan.webp',
    }
];

export default function AuthorBadge({ authorId }: { authorId: string }) {
    const author = AUTHORS.find(a => a.id === authorId) || AUTHORS[0];

    return (
        <div className="author-badge" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', marginTop: '2rem' }}>
            <img
                src={author.avatar}
                alt={author.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{author.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>{author.role}</div>
                <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{author.bio}</div>
            </div>
        </div>
    );
}
