import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { slugify } from '@/lib/helpers';

/**
 * POST /api/migrate-slugs
 * One-time migration: updates all existing articles that still have
 * English slugs to use Vietnamese slugs generated from translatedTitle.
 * 
 * PROTECTED: requires the ADMIN_PASSWORD in the Authorization header
 * Authorization: Bearer <ADMIN_PASSWORD>
 */
export async function POST(req: Request) {
    // ── Auth check ────────────────────────────────────────────────────────
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const validPass = process.env.ADMIN_PASSWORD || 'bongda2026';

    if (!token || token !== validPass) {
        return NextResponse.json({ error: 'Unauthorized' }, {
            status: 401,
            headers: { 'WWW-Authenticate': 'Bearer realm="Admin"' },
        });
    }
    // ─────────────────────────────────────────────────────────────────────

    try {
        const db = await getDb();
        const articles = await db.collection('articles')
            .find({}, { projection: { _id: 1, translatedTitle: 1, slug: 1 } })
            .toArray();

        let updated = 0;
        const slugCounts: Record<string, number> = {};

        for (const article of articles) {
            if (!article.translatedTitle) continue;

            const baseSlug = slugify(article.translatedTitle);
            if (!baseSlug) continue;

            // Handle duplicates by appending counter
            slugCounts[baseSlug] = (slugCounts[baseSlug] || 0) + 1;
            const newSlug = slugCounts[baseSlug] === 1
                ? baseSlug
                : `${baseSlug}-${slugCounts[baseSlug]}`;

            if (newSlug !== article.slug) {
                await db.collection('articles').updateOne(
                    { _id: article._id },
                    { $set: { slug: newSlug } }
                );
                updated++;
            }
        }

        return NextResponse.json({
            success: true,
            total: articles.length,
            updated,
            message: `Updated ${updated} / ${articles.length} article slugs to Vietnamese.`
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
