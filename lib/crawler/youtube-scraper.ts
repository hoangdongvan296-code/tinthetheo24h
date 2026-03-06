import { saveVideos } from '../actions/video-actions';
import { XMLParser } from 'fast-xml-parser';

export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    publishedTimeText: string;
    channelHandle: string;
}

// Map handles to their actual YouTube Channel IDs for the RSS feed
const CHANNEL_MAP: Record<string, string> = {
    '@tv360vtt': 'UCbxWTKqVmD_AMeOIcKFhQ3Q',
    '@TV360Dinhcaobongda': 'UCbxWTKqVmD_AMeOIcKFhQ3Q',
    '@TV360FootballNews': 'UCFT8xSYCzdRhef830ezgWKQ',
    '@sctvthethaoofficial': 'UCiWyQp2HgKX2-WQUq11V8FA',
    '@FPTBongDaOfficial': 'UC2DGk3qvpPNzlFgkctbRCRA'
};

const TARGET_CHANNELS = Object.keys(CHANNEL_MAP);

/**
 * Check if the Date object is from "today" or "yesterday".
 * This replaces the text-based matching which breaks across languages.
 */
function isRecentVideo(publishDateStr: string): boolean {
    if (!publishDateStr) return false;

    const publishDate = new Date(publishDateStr);
    const now = new Date();

    // Calculate difference in hours
    const diffTime = Math.abs(now.getTime() - publishDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    // Accept videos published within the last 48 hours
    return diffHours <= 48;
}

export async function scrapeChannelVideos(handle: string): Promise<YouTubeVideo[]> {
    try {
        const channelId = CHANNEL_MAP[handle];
        if (!channelId) {
            console.error(`No Channel ID mapped for ${handle}`);
            return [];
        }

        const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}&t=${Date.now()}`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml',
            },
            cache: 'no-store',
        });

        const xmlData = await res.text();

        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        });
        const jsonObj = parser.parse(xmlData);

        const entries = jsonObj?.feed?.entry;
        if (!entries) {
            console.log(`[Video] No entries found in RSS for ${handle}`);
            return [];
        }

        // Handle both single object and array of objects
        const items = Array.isArray(entries) ? entries : [entries];

        return items.slice(0, 10).map((item: any) => {
            return {
                id: item['yt:videoId'],
                title: item.title,
                thumbnail: `https://i.ytimg.com/vi/${item['yt:videoId']}/hqdefault.jpg`,
                publishedTimeText: item.published, // ISO Date String: "2026-03-05T12:00:00+00:00"
                channelHandle: handle
            };
        });
    } catch (e) {
        console.error(`Error fetching YouTube RSS for ${handle}:`, e);
        return [];
    }
}

/**
 * Fetch all videos from all channels, filter to recent only, save to DB.
 */
export async function fetchTodayVideos(): Promise<YouTubeVideo[]> {
    try {
        const results = await Promise.all(TARGET_CHANNELS.map(h => scrapeChannelVideos(h)));

        // Flatten, filter recent only
        const todayVideos = results.flat().filter(v => {
            const isRecent = isRecentVideo(v.publishedTimeText);
            if (!isRecent) {
                console.log(`[Video] Skip (too old): "${v.title?.substring(0, 50)}" — ${v.publishedTimeText}`);
            }
            return isRecent;
        });

        // Deduplicate by video ID
        const uniqueMap = new Map<string, YouTubeVideo>();
        for (const v of todayVideos) {
            if (v.id && !uniqueMap.has(v.id)) uniqueMap.set(v.id, v);
        }

        const finalVideos = Array.from(uniqueMap.values());
        console.log(`[Video] Found ${finalVideos.length} recent videos via RSS.`);

        if (finalVideos.length > 0) {
            await saveVideos(finalVideos);
        }

        return finalVideos;
    } catch (error) {
        console.error('Error in fetchTodayVideos:', error);
        return [];
    }
}

export async function fetchAllHighlights(): Promise<YouTubeVideo[]> {
    return fetchTodayVideos();
}
