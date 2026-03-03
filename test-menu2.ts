import * as cheerio from 'cheerio';

async function fetchMenu() {
    try {
        const res = await fetch('https://www.tribalfootball.com');
        const html = await res.text();
        const $ = cheerio.load(html);

        console.log("--- TRIBAL FOOTBALL MENU LINKS ---");

        // Tribal football has a specific top nav class usually
        $('.wcl-navigation a, nav#wcl-global-nav a, header a').each((i, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().replace(/\s+/g, ' ').trim();
            if (href && text && text.length > 2) {
                console.log(`Text: ${text.padEnd(20)} | Href: ${href}`);
            }
        });

    } catch (e) {
        console.error(e);
    }
}
fetchMenu();
