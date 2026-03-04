import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkDb() {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    try {
        await client.connect();
        const db = client.db();

        const artCount = await db.collection('articles').countDocuments();
        const vidCount = await db.collection('videos').countDocuments();

        console.log(`Articles: ${artCount}, Videos: ${vidCount}`);

        if (artCount > 0) {
            const latestArticles = await db.collection('articles')
                .find()
                .sort({ createdAt: -1 })
                .limit(5)
                .toArray();

            console.log("\n--- LATEST ARTICLES ---");
            latestArticles.forEach((a, i) => {
                console.log(`${i + 1}. ${a.title || a.translatedTitle || 'No Title'} (Status: ${a.status})`);
            });
        }
    } catch (err) {
        console.error("DB check failed:", err);
    } finally {
        await client.close();
    }
}

checkDb();
