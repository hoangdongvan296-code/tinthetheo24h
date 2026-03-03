import { NextResponse } from 'next/server';
import { addCrawlerLog } from '@/lib/crawler/logger';
import { fetchTodayVideos } from '@/lib/crawler/youtube-scraper';

let isVideoCrawling = false;

async function runVideoCrawlerBackground() {
    if (isVideoCrawling) return;
    isVideoCrawling = true;

    const startTime = Date.now();
    await addCrawlerLog('🎬 Bắt đầu cào video mới trong ngày...', 'info');

    try {
        const videos = await fetchTodayVideos();
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        await addCrawlerLog(
            `🏁 Cào video hoàn tất! ${videos.length} video hôm nay đã lưu. (${elapsed}s)`,
            'info'
        );
    } catch (error: any) {
        await addCrawlerLog(`🚨 Lỗi crawl video: ${error.message}`, 'error');
    } finally {
        isVideoCrawling = false;
    }
}

export async function POST() {
    if (isVideoCrawling) {
        return NextResponse.json({
            success: false,
            message: 'Đang crawl video rồi, vui lòng chờ.'
        }, { status: 409 });
    }

    runVideoCrawlerBackground().catch(console.error);

    return NextResponse.json({
        success: true,
        message: '✅ Đã khởi chạy crawl video hôm nay (chạy nền).'
    });
}

export async function GET() {
    return NextResponse.json({ isVideoCrawling });
}
