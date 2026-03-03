import { getDb } from './mongodb';

async function publishAll() {
    try {
        const db = await getDb();
        const collection = db.collection('articles');
        const result = await collection.updateMany(
            {},
            { $set: { status: 'published' } }
        );
        console.log(`Successfully published ${result.modifiedCount} articles.`);
    } catch (e) {
        console.error('Error publishing:', e);
    }
    process.exit(0);
}

publishAll();
