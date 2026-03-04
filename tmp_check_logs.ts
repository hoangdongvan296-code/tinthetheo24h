import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkCrawlerLogs() {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    try {
        await client.connect();
        const db = client.db();
        const logs = await db.collection('crawler_logs').find().sort({ createdAt: -1 }).limit(50).toArray();
        console.log("Found", logs.length, "logs.");
        logs.forEach(l => {
            console.log(`[${l.createdAt.toLocaleString()}] [${l.type}] ${l.message}`);
        });
    } catch (err) {
        console.error("Failed to check logs:", err);
    } finally {
        await client.close();
    }
}

checkCrawlerLogs();
