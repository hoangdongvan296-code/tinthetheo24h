'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteArticle } from '@/lib/actions/article-actions';

export default function DeletePostButton({ postId }: { postId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.')) {
            setIsDeleting(true);
            try {
                const result = await deleteArticle(postId);
                if (result.success) {
                    router.refresh(); // Reload the page to reflect the deletion
                } else {
                    alert('Lỗi khi xóa bài viết. Vui lòng thử lại sau.');
                }
            } catch (error) {
                console.error('Lỗi khi gọi hàm xóa:', error);
                alert('Đã xảy ra lỗi không mong muốn.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
                color: '#d63638',
                background: 'none',
                border: 'none',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                fontSize: '0.75rem',
                padding: 0,
                opacity: isDeleting ? 0.5 : 1
            }}
        >
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
        </button>
    );
}
