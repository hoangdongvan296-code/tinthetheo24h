import { NextResponse } from 'next/server';
import { addCrawlerLog } from '@/lib/crawler/logger';
import { scrapeCategory } from '@/lib/crawler/scraper';
import { CATEGORIES } from '@/lib/crawler/categories';
import { processSingleArticle } from '@/lib/ai/pipeline';
import { getDb } from '@/lib/mongodb';

// Concurrency lock — prevents overlapping crawl runs
let isCrawling = false;

/**
 * Check if an article's scraped date is from today (VN timezone).
 * Falls back to checking if the article URL slug or title doesn't already exist in DB.
 */
function isTodayArticle(article: any): boolean {
    // If scraper provides a publishedAt field, use it
    if (article.publishedAt) {
        const now = new Date();
        const pub = new Date(article.publishedAt);
        return (
            pub.getFullYear() === now.getFullYear() &&
            pub.getMonth() === now.getMonth() &&
            pub.getDate() === now.getDate()
        );
    }
    // Fallback: allow — the duplicate check in pipeline will reject old articles
    return true;
}

async function runCrawlerBackground() {
    if (isCrawling) return;
    isCrawling = true;

    const startTime = Date.now();
    let totalNew = 0;
    let totalSkipped = 0;

    try {
        await addCrawlerLog('🚀 Bắt đầu cào tin tức tự động...', 'info');

        for (const targetCategory of CATEGORIES) {
            await addCrawlerLog(`📂 Danh mục: ${targetCategory.name}`, 'info');

            let articles: any[] = [];
            try {
                articles = await scrapeCategory(targetCategory.url, targetCategory.name);
            } catch (e: any) {
                await addCrawlerLog(`❌ Lỗi scrape ${targetCategory.name}: ${e.message}`, 'error');
                continue;
            }

            await addCrawlerLog(`   Tìm thấy ${articles.length} bài.`, 'info');

            let countThisCategory = 0;

            for (const article of articles) {
                // Stop after 2 new articles per category
                if (countThisCategory >= 2) break;

                // Today-only filter
                if (!isTodayArticle(article)) {
                    totalSkipped++;
                    // Optional: noisy log, simplified
                    continue;
                }

                await addCrawlerLog(`   ⚙️  Xử lý: ${article.title?.substring(0, 60)}...`, 'info');

                try {
                    const result = await processSingleArticle(article);
                    if (result && (result as any).duplicate) {
                        await addCrawlerLog(`   ↩️  Bài đã tồn tại — dừng danh mục này.`, 'info');
                        break;
                    } else if (result) {
                        countThisCategory++;
                        totalNew++;
                        await addCrawlerLog(`   ✅ Đã xuất bản: ${result.translatedTitle?.substring(0, 60)}...`, 'info');
                    }
                } catch (err: any) {
                    await addCrawlerLog(`   ❌ Lỗi xử lý: ${err.message}`, 'error');
                }
            }

            await addCrawlerLog(`   📊 Kết quả ${targetCategory.name}: +${countThisCategory} bài mới`, 'info');
        }

        const elapsed = Math.round((Date.now() - startTime) / 1000);
        await addCrawlerLog(
            `🏁 Hoàn tất! Tổng: ${totalNew} bài mới | ${totalSkipped} bỏ qua | Thời gian: ${elapsed}s`,
            'info'
        );

        // Auto-cleanup logs older than 7 days
        try {
            const db = await getDb();
            const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            await db.collection('crawler_logs').deleteMany({ createdAt: { $lt: cutoff } });
        } catch { /* non-critical */ }

    } catch (error: any) {
        console.error('Crawler System Error:', error);
        try {
            await addCrawlerLog(`🚨 Lỗi hệ thống: ${error.message}`, 'error');
        } catch { /* double failure */ }
    } finally {
        isCrawling = false;
    }
}


export async function POST() {
    if (isCrawling) {
        return NextResponse.json({
            success: false,
            message: 'Đang có tiến trình crawl đang chạy. Vui lòng chờ.'
        }, { status: 409 });
    }

    // Fire and forget — returns immediately, crawl runs in background
    runCrawlerBackground().catch(console.error);

    return NextResponse.json({
        success: true,
        message: '✅ Đã khởi chạy crawl tin tức (chạy nền). Xem logs để theo dõi tiến độ.'
    });
}

export async function GET() {
    return NextResponse.json({ isCrawling });
}
