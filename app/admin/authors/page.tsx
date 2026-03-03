import { getAuthors, seedDefaultAuthors } from '@/lib/actions/author-actions';
import AuthorList from './AuthorList';

export const metadata = { title: 'Quản lý Tác giả - Admin' };

export default async function AuthorsPage() {
    // Auto-seed if no authors exist
    await seedDefaultAuthors();

    const authors = await getAuthors();

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900' }}>👤 Quản lý Tác giả</h1>
                    <p style={{ margin: '0.3rem 0 0', color: '#888', fontSize: '0.9rem' }}>
                        Tác giả sẽ được luân phiên gán tự động cho bài viết mới khi xuất bản.
                    </p>
                </div>
            </div>

            {/* Round-robin explanation */}
            <div style={{ background: '#fffbef', border: '1px solid #FFE066', borderRadius: '10px', padding: '1rem 1.2rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.7 }}>
                <strong>⚙️ Cơ chế tự động:</strong> Khi bài viết mới được xuất bản, hệ thống sẽ <strong>tự động luân phiên gán tác giả</strong> theo thứ tự "ai được gán lâu nhất thì được gán tiếp theo" — đảm bảo bài viết không tập trung vào một tác giả duy nhất.
            </div>

            <AuthorList authors={authors as any} />
        </div>
    );
}
