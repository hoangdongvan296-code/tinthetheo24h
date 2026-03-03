import * as cheerio from 'cheerio';

async function fetchScores() {
    const response = await fetch('https://thethao247.vn/lich-thi-dau-bong-da/');
    const html = await response.text();
    const $ = cheerio.load(html);

    // Approach: Iterate through all relevant elements in order of appearance
    const elements = $('li.caption-days, .category-title, li.match-info');

    let currentLeague = 'Thế Giới';
    let currentDate = '';

    console.log("Analyzing schedule flow...");

    let matchCount = 0;
    elements.each((_, el) => {
        const $el = $(el);
        if ($el.hasClass('category-title')) {
            currentLeague = $el.text().replace('Lịch thi đấu', '').replace(/\s+/g, ' ').trim();
            console.log("--- New League: " + currentLeague);
        } else if ($el.hasClass('caption-days')) {
            currentDate = $el.text().trim();
            console.log("--- New Date: " + currentDate);
        } else if ($el.hasClass('match-info')) {
            const home = $el.find('.team-a .name').text().trim() || $el.find('div:nth-child(2) div:nth-child(1) a.name').text().trim();
            const away = $el.find('.team-b .name').text().trim() || $el.find('div:nth-child(2) div:nth-child(3) a.name').text().trim();
            if (home && away && matchCount < 5) {
                console.log(`Match: ${home} - ${away} | League: ${currentLeague} | Date: ${currentDate}`);
                matchCount++;
            }
        }
    });
}
fetchScores();
