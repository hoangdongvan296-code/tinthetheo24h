import * as cheerio from 'cheerio';

async function diagnose(url: string) {
    console.log(`--- DIANOISING URL: ${url} ---`);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        console.log(`Title: ${$('title').text()}`);
        console.log(`P tags count: ${$('p').length}`);

        // Find containers with many paragraphs to locate article body
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

        console.log('\n--- Likely Content Containers (by P count) ---');
        Object.entries(containerScores).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).forEach(([sel, count]) => {
            console.log(`${sel}: ${count} paragraphs`);
        });

        const topContainer = Object.entries(containerScores).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];

        if (topContainer) {
            console.log(`\n--- Media in Top Container (${topContainer}) ---`);
            $(topContainer).find('img').each((i, el) => {
                console.log(`Img[${i}]: src=${$(el).attr('src')} alt=${$(el).attr('alt')}`);
            });

            $(topContainer).find('blockquote, iframe, .twitter-tweet').each((i, el) => {
                console.log(`Embed[${i}]: Tag=${$(el).prop('tagName')} class=${$(el).attr('class')}`);
            });
        }

    } catch (error) {
        console.error(error);
    }
}

diagnose('https://www.tribalfootball.com/article/soccer-champions-league-vinicius-has-the-last-laugh-as-real-madrid-beat-benfica-and-book-last-16-place-cbf86e5e-f232-4032-b6ea-29d43643eadb');
