import { getDb } from './mongodb';

async function listArticles() {
    const db = await getDb();
    const articles = await db.collection('articles').find({ status: 'published' }).sort({ createdAt: -1 }).limit(5).toArray();

    console.log('--- LATEST PUBLISHED ARTICLES ---');
    articles.forEach((a, i) => {
        console.log(`${i + 1}. ${a.translatedTitle}`);
        console.log(`   Slug: ${a.slug}`);
    });
    process.exit(0);
}

listArticles().catch(console.error);
