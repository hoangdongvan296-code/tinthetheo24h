import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkLogs() {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI not found in .env.local");
        return;
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db();
        const logs = await db.collection('crawler_logs')
            .find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();

        console.log("--- LATEST CRAWLER LOGS ---");
        logs.reverse().forEach(log => {
            const time = log.createdAt.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            console.log(`[${time}] [${log.type.toUpperCase()}] ${log.message}`);
        });

        if (logs.length === 0) {
            console.log("No logs found in crawler_logs collection.");
        }
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    } finally {
        await client.close();
    }
}

checkLogs();
