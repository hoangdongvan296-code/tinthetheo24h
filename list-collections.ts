import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listCollections() {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI not found in .env.local");
        return;
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db();
        const collections = await db.listCollections().toArray();
        console.log("--- COLLECTIONS ---");
        collections.forEach(c => console.log(`- ${c.name}`));

        // Check if crawler_logs has any data even if empty array returned before
        const count = await db.collection('crawler_logs').countDocuments();
        console.log(`\nDocuments in 'crawler_logs': ${count}`);

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    } finally {
        await client.close();
    }
}

listCollections();
