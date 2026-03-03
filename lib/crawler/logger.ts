import { getDb } from '../mongodb';

export async function addCrawlerLog(message: string, type: 'info' | 'warn' | 'error' = 'info') {
    try {
        const db = await getDb();
        const collection = db.collection('crawler_logs');

        await collection.insertOne({
            message,
            type,
            createdAt: new Date(),
        });
    } catch (err) {
        console.error(`[DB LOG ERROR] Could not save log to MongoDB:`, err);
    }

    console.log(`[CRAWLER LOG] ${type.toUpperCase()}: ${message}`);
}


export async function getCrawlerLogs(limit = 50) {
    const db = await getDb();
    const logs = await db
        .collection('crawler_logs')
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

    return logs.reverse();
}

export async function clearCrawlerLogs() {
    const db = await getDb();
    await db.collection('crawler_logs').deleteMany({});
}
