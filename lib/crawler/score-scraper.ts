import * as cheerio from 'cheerio';

export interface MatchInfo {
    date: string;
    time: string;
    homeTeam: string;
    homeLogo?: string;
    score: string;
    awayTeam: string;
    awayLogo?: string;
    league: string;
}

export async function scrapeSchedules(url: string = 'https://thethao247.vn/lich-thi-dau-bong-da/'): Promise<MatchInfo[]> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const matches: MatchInfo[] = [];

        // Thethao247 DOM is deeply nested but headings appear sequentially
        const elements = $('li.caption-days, .category-title, li.match-info');

        let currentLeague = 'Thế Giới';
        let currentDate = 'Hôm nay';

        elements.each((_, element) => {
            const $el = $(element);

            if ($el.hasClass('category-title')) {
                currentLeague = $el.text().replace('Lịch thi đấu', '').replace(/\s+/g, ' ').trim() || 'Thế Giới';
            } else if ($el.hasClass('caption-days')) {
                currentDate = $el.text().replace(/\s+/g, ' ').trim() || 'Hôm nay';
            } else if ($el.hasClass('match-info')) {
                const timeRaw = $el.find('.time').text().replace(/\s+/g, ' ').trim();
                const timeParts = timeRaw.split(' ');
                const time = timeParts.length > 0 ? timeParts[0] : (timeRaw || '00:00');

                const homeTeam = $el.find('.team-a .name').text().trim() || $el.find('div:nth-child(2) div:nth-child(1) a.name').text().trim();
                const homeLogo = $el.find('.team-a img').attr('src') || $el.find('div:nth-child(2) div:nth-child(1) img').attr('src');

                const scoreRaw = $el.find('.score').text().replace(/\s+/g, '').trim();
                let score = scoreRaw;
                if (scoreRaw === '?-?') score = '-';

                const awayTeam = $el.find('.team-b .name').text().trim() || $el.find('div:nth-child(2) div:nth-child(3) a.name').text().trim();
                const awayLogo = $el.find('.team-b img').attr('src') || $el.find('div:nth-child(2) div:nth-child(3) img').attr('src');

                if (homeTeam && awayTeam) {
                    matches.push({
                        date: currentDate,
                        time,
                        homeTeam,
                        homeLogo,
                        score,
                        awayTeam,
                        awayLogo,
                        league: currentLeague
                    });
                }
            }
        });

        return matches;
    } catch (error) {
        console.error(`Error scraping schedules from ${url}:`, error);
        return [];
    }
}
