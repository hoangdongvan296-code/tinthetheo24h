import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    const client = new MongoClient(process.env.MONGODB_URI || '');
    try {
        await client.connect();
        console.log("Connected successfully to DB");
        const db = client.db();
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const latestArticle = await db.collection('articles').find().sort({ createdAt: -1 }).limit(1).toArray();
        console.log("Latest Article:", latestArticle[0]?.title, "Date:", latestArticle[0]?.createdAt);

        const latestVideo = await db.collection('videos').find().sort({ createdAt: -1 }).limit(1).toArray();
        console.log("Latest Video:", latestVideo[0]?.title, "Date:", latestVideo[0]?.createdAt);

    } catch (err) {
        console.error("Connection failed:", err);
    } finally {
        await client.close();
    }
}

testConnection();
