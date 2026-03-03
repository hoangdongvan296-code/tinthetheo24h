import { MongoClient } from 'mongodb';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    const db = client.db();
    const article = await db.collection('articles').findOne({ translatedTitle: { $regex: /hincapie/i } });
    if (article) {
        fs.writeFileSync('debug-arsenal.html', article.translatedContent);
        console.log("Saved to debug-arsenal.html");
    } else {
        console.log("No articles found matching 'hincapie'");
    }
    await client.close();
}

check();
