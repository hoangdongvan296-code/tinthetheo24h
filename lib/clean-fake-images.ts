import { getDb } from './mongodb';

async function cleanImages() {
    try {
        const db = await getDb();
        const collection = db.collection('articles');
        const articles = await collection.find({}).toArray();
        let modifiedCount = 0;

        for (const article of articles) {
            if (!article.translatedContent) continue;

            const originalContent = article.translatedContent;

            // Reconstruct HTML by removing any figure where the img src doesn't start with http
            let newContent = originalContent.replace(/<figure[^>]*>.*?<img[^>]*src=["']([^"']+)["'].*?<\/figure>/g, (match: string, src: string) => {
                if (!src.startsWith('http')) {
                    // It's a fake URL, return empty string to delete it
                    return '';
                }
                return match;
            });

            if (newContent !== originalContent) {
                await collection.updateOne(
                    { _id: article._id },
                    { $set: { translatedContent: newContent } }
                );
                modifiedCount++;
                console.log(`CLEANED fake URLs in: ${article.slug}`);
            }
        }

        console.log(`Finished cleaning. Total updated: ${modifiedCount}`);
    } catch (e) {
        console.error('Error cleaning images:', e);
    }
    process.exit(0);
}

cleanImages();
