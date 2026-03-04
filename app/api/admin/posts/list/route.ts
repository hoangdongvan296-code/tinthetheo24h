import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/actions/article-actions';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || undefined;
        const posts = await getArticles(status);
        return NextResponse.json({ posts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
