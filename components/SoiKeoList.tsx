import Link from 'next/link';

export default function SoiKeoList({ insights }: { insights: any[] }) {
    return (
        <div className="soi-keo-section" style={{ marginTop: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ borderLeft: '5px solid #FFD700', paddingLeft: '1rem', margin: 0 }}>
                    Soi kèo & Nhận định chuyên gia
                </h2>
                <Link href="/soi-keo" style={{ fontSize: '0.9rem', color: '#2271b1' }}>Xem tất cả</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {insights.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <img src={item.image} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} alt={item.title} />
                        <div>
                            <Link href={`/soi-keo/${item.slug}`} style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#000', textDecoration: 'none' }}>
                                {item.title}
                            </Link>
                            <p style={{ fontSize: '0.85rem', color: '#666', margin: '8px 0' }}>{item.excerpt}</p>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>Bởi: {item.author} • {item.date}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
