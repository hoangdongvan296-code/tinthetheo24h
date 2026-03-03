import * as cheerio from 'cheerio';
import * as fs from 'fs';

export async function checkDates(url: string = 'https://thethao247.vn/lich-thi-dau-bong-da/') {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const elementsBorderingListMatch: any[] = [];

    $('.list-match').slice(0, 5).each((i, el) => {
        elementsBorderingListMatch.push({
            prevHtml: $(el).prev().html()?.replace(/\s+/g, ' '),
            prevText: $(el).prev().text().trim(),
            prevPrevHtml: $(el).prev().prev().html()?.replace(/\s+/g, ' '),
            firstMatchTime: $(el).find('li.match-info, .match-info').first().find('.time').text().replace(/\s+/g, ' ').trim()
        });
    });

    fs.writeFileSync('test-dates.json', JSON.stringify(elementsBorderingListMatch, null, 2));
}

checkDates();
