import { processSingleArticle } from './ai/pipeline';
import { CATEGORIES } from './crawler/categories';
import { scrapeCategory } from './crawler/scraper';

async function crawlThree() {
    console.log('--- STARTING CRAWL OF 3 ARTICLES (IMPROVED) ---');
    let count = 0;

    // Find the 'Chuyển nhượng' category
    const targetCategory = CATEGORIES.find(c => c.name === 'Chuyển nhượng');

    if (!targetCategory) {
        console.error("Category 'Chuyển nhượng' not found.");
        process.exit(1);
    }

    console.log(`Scraping category: ${targetCategory.name}`);
    const articles = await scrapeCategory(targetCategory.url, targetCategory.name);

    for (const article of articles) {
        if (count >= 3) break; // Limit to 3 articles

        try {
            const result = await processSingleArticle(article);
            if (result) {
                count++;
                console.log(`[${count}/3] Successfully processed: ${result.translatedTitle}`);
            }
        } catch (error) {
            console.error(`Error processing article:`, error);
        }
    }

    console.log(`--- CRAWL TASK FINISHED. TOTAL PROCESSED: ${count} ---`);
    process.exit(0);
}

crawlThree().catch(err => {
    console.error(err);
    process.exit(1);
});
