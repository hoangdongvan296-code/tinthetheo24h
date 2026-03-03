import { getAuthorById } from '@/lib/actions/author-actions';
import AuthorForm from '../AuthorForm';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Chỉnh sửa tác giả - Admin' };

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const author = await getAuthorById(id);
    if (!author) return notFound();

    return (
        <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.6rem', fontWeight: '900' }}>✏️ Chỉnh sửa tác giả</h1>
            <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Cập nhật thông tin cho tác giả <strong>{author.name}</strong>
            </p>
            <AuthorForm mode="edit" initialData={author} />
        </div>
    );
}
