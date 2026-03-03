import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function getMenus() {
    const r = await fetch('https://www.tribalfootball.com/');
    const html = await r.text();
    const $ = cheerio.load(html);

    const leagues = ['bundesliga', 'serie a', 'ligue 1', 'europa league', 'champions league'];
    const results: any[] = [];

    $('a').each((i, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (leagues.includes(text)) {
            results.push({ name: $(el).text().trim(), url: $(el).attr('href') });
        }
    });

    const unique = Array.from(new Set(results.map(a => JSON.stringify(a)))).map(a => JSON.parse(a));
    fs.writeFileSync('test-menus.json', JSON.stringify(unique, null, 2));
}

getMenus();
