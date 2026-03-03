import { getDb } from './mongodb';

async function fixMediaTags() {
    try {
        const db = await getDb();
        const collection = db.collection('articles');
        const articles = await collection.find({}).toArray();
        let modifiedCount = 0;

        for (const article of articles) {
            if (!article.translatedContent) continue;

            let finalHtml = article.translatedContent;

            // 1. Convert media embeds manually
            finalHtml = finalHtml.replace(/\[MEDIA_EMBED:\s*([\s\S]+?)\]/g, (match: string, htmlCode: string) => {
                return htmlCode;
            });

            // 2. Convert media images manually
            finalHtml = finalHtml.replace(/\[MEDIA_IMAGE:\s*(.+?)\s*\|\s*(.*?)\s*\]/g, (match: string, url: string, alt: string) => {
                return `<figure style="margin: 3rem 0; text-align: center;"><img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" /><figcaption style="color: #888; margin-top: 1.2rem; font-style: italic; font-size: 0.95rem; padding: 0 2rem;">Ảnh: ${alt}</figcaption></figure>`;
            });

            if (finalHtml !== article.translatedContent) {
                await collection.updateOne(
                    { _id: article._id },
                    { $set: { translatedContent: finalHtml } }
                );
                modifiedCount++;
                console.log(`Updated article: ${article.slug}`);
            }
        }

        console.log(`Finished fixing media tags. Total updated: ${modifiedCount}`);
    } catch (e) {
        console.error('Error fixing media tags:', e);
    }
    process.exit(0);
}

fixMediaTags();
