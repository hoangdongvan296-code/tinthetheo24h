import { NextResponse } from 'next/server';
import { deleteArticle } from '@/lib/actions/article-actions';

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await deleteArticle(id);
        if (result.success) {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ success: false, message: 'Xóa thất bại' }, { status: 500 });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
