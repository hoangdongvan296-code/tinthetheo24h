import { processArticle } from '../ai/pipeline';
import { CATEGORIES } from '../crawler/categories';
import { pushToSocial } from './social-pilot';

async function mainJob() {
    console.log('--- STARTING HOURLY CRAWL JOB ---');

    for (const cat of CATEGORIES) {
        try {
            console.log(`Processing category: ${cat.name}`);
            const article = await processArticle(cat.url, cat.name);

            if (article) {
                console.log(`Successfully processed: ${article.translatedTitle}`);
                // Push to Social Media
                await pushToSocial(
                    article.translatedTitle,
                    `https://bongda2026auto.com/tin-tuc/${article.originalTitle.toLowerCase().replace(/ /g, '-')}`,
                    article.translatedContent.substring(0, 200) + '...'
                );
            }
        } catch (error) {
            console.error(`Error in category ${cat.name}:`, error);
        }
    }

    console.log('--- HOURLY CRAWL JOB FINISHED ---');
}

mainJob().catch(console.error);
