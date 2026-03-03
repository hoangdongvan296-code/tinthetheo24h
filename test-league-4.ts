import * as cheerio from 'cheerio';
import * as fs from 'fs';

const html = fs.readFileSync('test-html.html', 'utf8');
const $ = cheerio.load(html);

$('li.match-info').slice(0, 5).each((i, el) => {
    const $el = $(el);
    let league = '';

    // Attempt 1: Look for `.category-title` before the `.list_match` block
    const listMatch = $el.closest('.list_match');
    if (listMatch.length) {
        const prevH2 = listMatch.prev('.category-title, h2, h3');
        if (prevH2.length) {
            league = prevH2.text().replace(/\s+/g, ' ').trim();
        } else {
            const parentBox = listMatch.parent('.box_livescore, .box-match-category');
            if (parentBox.length) {
                league = parentBox.prev('.category-title, h2, h3').text().replace(/\s+/g, ' ').trim();
            }
        }
    }

    console.log(`Match ${i}: ${league || 'NOT FOUND'}`);
});
