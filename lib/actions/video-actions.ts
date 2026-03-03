'use server';

import { getDb } from '../mongodb';
import { YouTubeVideo } from '../crawler/youtube-scraper';
import { slugify } from '../helpers';

export async function saveVideos(videos: YouTubeVideo[]) {
    try {
        const db = await getDb();
        const collection = db.collection('videos');

        for (const video of videos) {
            const slug = slugify(video.title);
            // Upsert based on video ID to avoid duplicates
            await collection.updateOne(
                { videoId: video.id },
                {
                    $set: {
                        videoId: video.id,
                        title: video.title,
                        slug: slug,
                        thumbnail: video.thumbnail,
                        league: video.channelHandle.replace('@', ''), // This is the channel handle
                        createdAt: new Date()
                    }
                },
                { upsert: true }
            );
        }
        return { success: true };
    } catch (error) {
        console.error('Error saving videos to DB:', error);
        return { success: false };
    }
}

export async function getVideos(limit: number = 20) {
    try {
        const db = await getDb();
        const videos = await db
            .collection('videos')
            .find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();

        // Convert to the exact format needed by UI components
        return videos.map(vid => ({
            id: vid._id.toString(),
            videoId: vid.videoId,
            title: vid.title,
            slug: vid.slug || slugify(vid.title),
            videoUrl: `https://www.youtube.com/watch?v=${vid.videoId}`,
            thumbnail: vid.thumbnail,
            league: vid.league
        }));
    } catch (error) {
        console.error('Error fetching videos from DB:', error);
        return [];
    }
}

export async function deleteVideo(videoId: string) {
    try {
        const db = await getDb();
        await db.collection('videos').deleteOne({ videoId });
        return { success: true };
    } catch (error) {
        console.error('Error deleting video:', error);
        return { success: false };
    }
}

export async function deleteVideosByChannel(channelHandle: string) {
    try {
        const db = await getDb();
        const handleWithoutAt = channelHandle.replace('@', '');
        await db.collection('videos').deleteMany({ league: handleWithoutAt });
        return { success: true };
    } catch (error) {
        console.error('Error deleting videos by channel:', error);
        return { success: false };
    }
}

export async function getVideoById(videoId: string) {
    try {
        const db = await getDb();
        const video = await db.collection('videos').findOne({ videoId });

        if (video) {
            return {
                title: video.title,
                slug: video.slug || slugify(video.title),
                videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
                thumbnail: video.thumbnail,
                league: video.league,
                videoId: video.videoId,
                createdAt: video.createdAt
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching video by ID from DB:', error);
        return null;
    }
}
