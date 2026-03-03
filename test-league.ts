import * as cheerio from 'cheerio';
import * as fs from 'fs';

const html = fs.readFileSync('test-html.html', 'utf8');
const $ = cheerio.load(html);

$('li.match-info').slice(0, 3).each((i, el) => {
    const $el = $(el);
    const league1 = $el.closest('ul.list_match').prev().text().replace(/\s+/g, ' ').trim();
    const league2 = $el.closest('.box-match-category').find('.category-title').text().replace(/\s+/g, ' ').trim();
    const league3 = $el.parentsUntil('.box-match-category').last().prev().text().replace(/\s+/g, ' ').trim();

    console.log(`Match ${i}`);
    console.log(`League 1 (ul.list_match prev): "${league1}"`);
    console.log(`League 2 (.box-match-category .category-title): "${league2}"`);
    console.log(`League 3 (parentsUntil prev): "${league3}"`);
});
