import { scrapeCategory, scrapeArticleContent } from './scraper';
import { CATEGORIES } from './categories';

async function test() {
    console.log('--- Testing Category Scraper ---');
    const cat = CATEGORIES[0]; // Chuyển nhượng
    console.log(`Scraping category: ${cat.name} (${cat.url})`);

    const articles = await scrapeCategory(cat.url, cat.name);
    console.log(`Found ${articles.length} articles.`);

    if (articles.length > 0) {
        const firstArticle = articles[0];
        console.log('First article found:', firstArticle);

        console.log('\n--- Testing Content Scraper ---');
        console.log(`Scraping content for: ${firstArticle.url}`);
        const content = await scrapeArticleContent(firstArticle.url);
        console.log('Content snippet:', content.content.substring(0, 200) + '...');
        console.log('Image URL:', content.imageUrl);
    }
}

test().catch(console.error);
