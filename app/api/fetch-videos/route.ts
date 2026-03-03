import { NextResponse } from 'next/server';
import { fetchAllHighlights } from '../../../lib/crawler/youtube-scraper';

export async function GET() {
    try {
        const videos = await fetchAllHighlights(); // This method now naturally saves to the DB internally
        return NextResponse.json({ success: true, count: videos.length, videos });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
