import { NextResponse } from 'next/server';
import { scrapeSchedules } from '@/lib/crawler/score-scraper';

export async function GET() {
    try {
        const matches = await scrapeSchedules();
        return NextResponse.json(matches);
    } catch (error) {
        console.error('API Matches Error:', error);
        return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
    }
}
