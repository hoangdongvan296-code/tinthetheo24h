import * as cheerio from 'cheerio';

async function fetchMenu() {
    try {
        const res = await fetch('https://www.tribalfootball.com');
        const html = await res.text();
        const $ = cheerio.load(html);

        console.log("--- TRIBAL FOOTBALL MENU LINKS ---");

        // Find typical navigation elements
        $('nav a, header a.nav-link, .menu a, .navigation a, [role="navigation"] a').each((i, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            if (href && text && text.length > 2 && text.length < 30) {
                console.log(`Text: ${text.padEnd(20)} | Href: ${href}`);
            }
        });

    } catch (e) {
        console.error(e);
    }
}
fetchMenu();
