import { processSingleArticle } from './ai/pipeline';
import { getDb } from './mongodb';

async function crawlSpecific() {
    const scrapedDummy = {
        title: "Vinicius has the last laugh as Real Madrid beat Benfica and book last 16 place",
        url: "https://www.tribalfootball.com/article/soccer-champions-league-vinicius-has-the-last-laugh-as-real-madrid-beat-benfica-and-book-last-16-place-cbf86e5e-f232-4032-b6ea-29d43643eadb",
        category: "Tin tức"
    };

    console.log(`--- STARTING CRAWL OF SPECIFIC ARTICLE ---`);
    console.log(`URL: ${scrapedDummy.url}`);

    try {
        const result = await processSingleArticle(scrapedDummy);
        if (result) {
            console.log(`Successfully processed: ${result.originalTitle}`);

            // Mark as published so it shows on homepage
            const db = await require('./mongodb').getDb();
            await db.collection('articles').updateOne(
                { slug: result.slug },
                { $set: { status: 'published' } }
            );
            console.log(`Article published automatically.`);
            console.log(`Slug: ${result.slug}`);
        }
    } catch (error) {
        console.error(`Error processing article:`, error);
    }

    process.exit(0);
}

crawlSpecific();
