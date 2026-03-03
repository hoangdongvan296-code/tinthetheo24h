import { getArticleById } from '@/lib/actions/article-actions';
import Link from 'next/link';
import EditForm from './EditForm';

export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
        return <div className="admin-card">Không tìm thấy bài viết. <Link href="/admin/posts">Quay lại</Link></div>;
    }

    return (
        <div>
            <div className="admin-header">
                <h1>Chỉnh sửa bài viết</h1>
                <Link href="/admin/posts" className="btn-primary" style={{ background: '#eee', color: '#333', border: '1px solid #ccc', textDecoration: 'none' }}>
                    Hủy bỏ
                </Link>
            </div>

            <EditForm article={article} />
        </div>
    );
}
