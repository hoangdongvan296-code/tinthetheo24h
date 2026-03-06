import { saveVideos } from '../actions/video-actions';

export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    publishedTimeText: string;
    channelHandle: string;
}

const TARGET_CHANNELS = [
    '@tv360vtt',
    '@TV360Dinhcaobongda',
    '@TV360FootballNews',
    '@sctvthethaoofficial',
    '@FPTBongDaOfficial'
];

/**
 * Keywords indicating the video was published TODAY (relative time texts from YouTube).
 * YouTube shows relative times in English regardless of user locale when scraped server-side.
 */
const TODAY_KEYWORDS = [
    'second', 'minute', 'hour', 'day',        // English
    'giây', 'phút', 'giờ', 'ngày',           // Vietnamese (fallback)
    'Streamed live',                          // Live within last 24h
];

function isPublishedToday(publishedTimeText: string): boolean {
    if (!publishedTimeText) return false;
    const lower = publishedTimeText.toLowerCase();
    return TODAY_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
}

export async function scrapeChannelVideos(handle: string): Promise<YouTubeVideo[]> {
    try {
        const url = `https://www.youtube.com/${handle}/videos`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9', // Force English time strings
            },
            // Do NOT cache — always fetch fresh for cron
            cache: 'no-store',
        });
        const html = await res.text();

        const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
        if (!match) return [];

        const data = JSON.parse(match[1]);

        let tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs;
        if (!tabs) return [];

        let videosTab = tabs.find((t: any) =>
            t.tabRenderer?.title === 'Videos' ||
            t.tabRenderer?.endpoint?.commandMetadata?.webCommandMetadata?.url?.includes('/videos')
        );
        if (!videosTab) videosTab = tabs[1];

        const contents = videosTab?.tabRenderer?.content?.richGridRenderer?.contents;
        if (!contents) return [];

        return contents
            .map((c: any) => c.richItemRenderer?.content?.videoRenderer)
            .filter(Boolean)
            .slice(0, 10) // Check latest 10 per channel
            .map((v: any) => {
                let thumbUrl = v.thumbnail?.thumbnails?.[0]?.url;
                if (v.thumbnail?.thumbnails?.length > 1) {
                    thumbUrl = v.thumbnail.thumbnails[v.thumbnail.thumbnails.length - 1].url;
                }
                return {
                    id: v.videoId,
                    title: v.title?.runs?.[0]?.text,
                    thumbnail: thumbUrl,
                    publishedTimeText: v.publishedTimeText?.simpleText || '',
                    channelHandle: handle
                };
            });
    } catch (e) {
        console.error(`Error fetching YouTube channel ${handle}:`, e);
        return [];
    }
}

/**
 * Fetch all videos from all channels, filter to TODAY only, save to DB.
 */
export async function fetchTodayVideos(): Promise<YouTubeVideo[]> {
    try {
        const results = await Promise.all(TARGET_CHANNELS.map(h => scrapeChannelVideos(h)));

        // Flatten, filter today only
        const todayVideos = results.flat().filter(v => {
            const isToday = isPublishedToday(v.publishedTimeText);
            if (!isToday) {
                console.log(`[Video] Skip (not today): "${v.title?.substring(0, 50)}" — ${v.publishedTimeText}`);
            }
            return isToday;
        });

        // Deduplicate by video ID
        const uniqueMap = new Map<string, YouTubeVideo>();
        for (const v of todayVideos) {
            if (v.id && !uniqueMap.has(v.id)) uniqueMap.set(v.id, v);
        }

        const finalVideos = Array.from(uniqueMap.values());
        console.log(`[Video] Found ${finalVideos.length} videos published today.`);

        if (finalVideos.length > 0) {
            await saveVideos(finalVideos);
        }

        return finalVideos;
    } catch (error) {
        console.error('Error in fetchTodayVideos:', error);
        return [];
    }
}

/**
 * Legacy function — now routes to fetchTodayVideos.
 * Keep for backward compatibility with existing route handler.
 */
export async function fetchAllHighlights(): Promise<YouTubeVideo[]> {
    return fetchTodayVideos();
}
