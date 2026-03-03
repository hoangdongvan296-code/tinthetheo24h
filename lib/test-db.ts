import { getDb } from './mongodb';

async function testConnection() {
    console.log('Testing MongoDB connection...');
    try {
        const db = await getDb();
        const collections = await db.listCollections().toArray();
        console.log('Successfully connected to MongoDB!');
        console.log('Collections:', collections.map(c => c.name));
        process.exit(0);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

testConnection();
