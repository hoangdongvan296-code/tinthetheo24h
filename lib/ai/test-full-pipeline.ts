import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { processArticle } from './pipeline';
import { CATEGORIES } from '../crawler/categories';
import { scrapeSchedules } from '../crawler/score-scraper';

async function runFullTest() {
    console.log('=== TEST 1: Article Pipeline (Scrape -> AI Translate -> SEO Link) ===');
    const cat = CATEGORIES[0]; // Chuyển nhượng
    const article = await processArticle(cat.url, cat.name);

    if (article) {
        console.log('\n--- Final Processed Article ---');
        console.log('Title (Original):', article.originalTitle);
        console.log('Title (Translated):', article.translatedTitle);
        console.log('Category:', article.category);
        console.log('Image:', article.imageUrl);
        console.log('\nContent Sample (with SEO links):');
        console.log(article.translatedContent.substring(0, 500) + '...');
    }

    console.log('\n=== TEST 2: Match Schedules Crawler ===');
    const matches = await scrapeSchedules();
    console.log(`Found ${matches.length} matches.`);
    if (matches.length > 0) {
        console.log('Sample Match:', matches[0]);
    }
}

runFullTest().catch(console.error);
