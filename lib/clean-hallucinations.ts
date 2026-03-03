import { getDb } from './mongodb';

async function cleanup() {
    const db = await getDb();
    const cursor = db.collection('articles').find({
        $or: [
            { translatedContent: { $regex: /example\.com/ } },
            { translatedContent: { $regex: /your_video_id/ } }
        ]
    });

    const articles = await cursor.toArray();
    console.log(`Found ${articles.length} articles to clean up.`);

    for (const article of articles) {
        let cleanedContent = article.translatedContent;

        // Remove figure blocks with example.com
        cleanedContent = cleanedContent.replace(/<figure[^>]*>[\s\S]*?example\.com[\s\S]*?<\/figure>/g, '');
        // Remove iframe blocks with your_video_id
        cleanedContent = cleanedContent.replace(/<iframe[^>]*your_video_id[^>]*><\/iframe>/g, '');
        // Also remove raw [MEDIA_...] tags if any escaped
        cleanedContent = cleanedContent.replace(/\[MEDIA_IMAGE:\s*https?:\/\/example\.com\/[^\]]+\]/g, '');
        cleanedContent = cleanedContent.replace(/\[MEDIA_EMBED:\s*your_video_id[^\]]*\]/g, '');

        if (cleanedContent !== article.translatedContent) {
            await db.collection('articles').updateOne(
                { _id: article._id },
                { $set: { translatedContent: cleanedContent } }
            );
            console.log(`Cleaned: ${article.translatedTitle}`);
        }
    }

    console.log('Cleanup complete.');
    process.exit(0);
}

cleanup().catch(console.error);
