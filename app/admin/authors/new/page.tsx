import AuthorForm from '../AuthorForm';

export const metadata = { title: 'Thêm tác giả mới - Admin' };

export default function NewAuthorPage() {
    return (
        <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.6rem', fontWeight: '900' }}>+ Thêm tác giả mới</h1>
            <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Tác giả mới sẽ tự động được gán bài viết bởi hệ thống luân phiên.
            </p>
            <AuthorForm mode="create" />
        </div>
    );
}
