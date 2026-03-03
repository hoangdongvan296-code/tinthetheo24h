import * as cheerio from 'cheerio';

async function testScrape(articleUrl: string) {
    try {
        console.log(`Fetching: ${articleUrl}`);
        const response = await fetch(articleUrl);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Current logic
        const contentEl = $('article').first();
        console.log(`Found article tag: ${contentEl.length > 0}`);

        // Let's also look for all text in common content containers
        console.log('--- Content in <article> ---');
        contentEl.find('p').each((_, el) => {
            console.log(`P: ${$(el).text().trim().substring(0, 50)}...`);
        });

        console.log('\n--- Content in secondary containers ---');
        $('.wcl-body, .wp-content, .article-body').find('p').each((_, el) => {
            console.log(`Secondary P: ${$(el).text().trim().substring(0, 50)}...`);
        });

        // Let's just find all paragraphs and see where they are
        console.log('\n--- All P tags on page ---');
        $('p').each((i, el) => {
            if (i < 10) console.log(`P[${i}]: ${$(el).text().trim().substring(0, 50)}...`);
        });

    } catch (error) {
        console.error(error);
    }
}

const url = 'https://www.tribalfootball.com/articles/juventus-legend-marchisio-urges-club-to-sign-newcastles-tonali-5085698';
testScrape(url);
