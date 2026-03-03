import { MongoClient } from 'mongodb';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    const db = client.db();
    const article = await db.collection('articles').findOne({});
    if (article) {
        fs.writeFileSync('debug-article.html', article.translatedContent);
        console.log("Saved to debug-article.html");
    } else {
        console.log("No articles found");
    }
    await client.close();
}

check();
