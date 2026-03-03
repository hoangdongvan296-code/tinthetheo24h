import * as cheerio from 'cheerio';
import fs from 'fs';

async function diagnose() {
    const url = 'https://www.tribalfootball.com/article/soccer-champions-league-extra-time-showing-sends-galatasaray-through-past-sensational-ten-man-juventus-92b95c24-7aee-4e0e-87f1-8081a0442436';
    console.log('--- DIAGNOSING URL: ' + url + ' ---');
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await res.text();
        const $ = cheerio.load(html);

        console.log('OG:IMAGE:', $('meta[property="og:image"]').attr('content'));
        console.log('TWITTER:IMAGE:', $('meta[name="twitter:image"]').attr('content'));

        console.log('\n--- ALL IMAGES ---');
        $('img').each((i, el) => {
            console.log(`IMG[${i}]: src=${$(el).attr('src')} alt=${$(el).attr('alt')}`);
        });

        // Check specifically for the hero image in the main content
        const containerScores: any = {};
        $('p').each((_, el) => {
            const parent = $(el).parent();
            if (parent && parent.length > 0) {
                const tagName = parent.prop('tagName') || '';
                const className = parent.attr('class') ? '.' + (parent.attr('class') || '').split(' ').join('.') : '';
                const sel = tagName + className;
                containerScores[sel] = (containerScores[sel] || 0) + 1;
            }
        });
        const topSelector = Object.entries(containerScores).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];
        console.log('\nTOP CONTAINER:', topSelector);

        if (topSelector) {
            console.log('\n--- IMAGES IN TOP CONTAINER ---');
            $(topSelector).find('img').each((i, el) => {
                console.log(`CONTAINER_IMG[${i}]: src=${$(el).attr('src')} alt=${$(el).attr('alt')}`);
            });
        }

    } catch (e) {
        console.error(e);
    }
}

diagnose();
