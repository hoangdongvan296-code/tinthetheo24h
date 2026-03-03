import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

// ── Simple in-memory rate limiter (per IP, max 20 req/min) ────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}
// ─────────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() ?? '';

    if (query.length < 2) {
        return NextResponse.json([]);
    }

    // Sanitize: max 100 chars, only allow safe characters
    const safeQuery = query.substring(0, 100).replace(/[<>"'`]/g, '');

    try {
        const db = await getDb();
        const articles = await db.collection('articles')
            .find({
                status: 'published',
                $or: [
                    { translatedTitle: { $regex: safeQuery, $options: 'i' } },
                    { originalTitle: { $regex: safeQuery, $options: 'i' } },
                    { category: { $regex: safeQuery, $options: 'i' } }
                ]
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .project({ translatedTitle: 1, slug: 1, category: 1, imageUrl: 1, createdAt: 1 }) // only send needed fields
            .toArray();

        return NextResponse.json(articles, {
            headers: {
                'Cache-Control': 'no-store',
                'X-Robots-Tag': 'noindex',
            },
        });
    } catch (error) {
        console.error('API Search Error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
