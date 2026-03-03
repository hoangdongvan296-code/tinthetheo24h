import * as cheerio from 'cheerio';
import * as fs from 'fs';

const html = fs.readFileSync('test-html.html', 'utf8');
const $ = cheerio.load(html);

$('li.match-info').slice(0, 3).each((i, el) => {
    const $el = $(el);
    const league = $el.closest('.box_livescore, .list_match').parent().prevAll('.category-title, h2, h3').first().text().replace('Lịch thi đấu', '').replace(/\s+/g, ' ').trim();

    console.log(`Match ${i}: ${league}`);
});
