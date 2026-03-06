const https = require('https');
const fs = require('fs');

async function checkVideosTab() {
    console.log("Fetching YouTube HTML to inspect the Videos tab...");
    const url = 'https://www.youtube.com/@tv360vtt/videos';

    https.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
    }, (res) => {
        let html = '';
        res.on('data', chunk => html += chunk);
        res.on('end', () => {
            const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
            if (!match) return;

            const data = JSON.parse(match[1]);
            const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs;

            let videosTab = tabs.find(t => t.tabRenderer?.title === 'Videos');
            if (!videosTab) videosTab = tabs[1];

            console.log("Analyzing Videos Tab (Title):", videosTab?.tabRenderer?.title);

            const content = videosTab?.tabRenderer?.content;
            if (!content) {
                console.log("No content found in tabRenderer!");
                return;
            }

            console.log("Keys in tabRenderer.content:", Object.keys(content));

            if (content.richGridRenderer) {
                console.log("Has richGridRenderer. Key check:");
                console.log(Object.keys(content.richGridRenderer));

                const gridContents = content.richGridRenderer.contents;
                if (!gridContents) {
                    console.log("No contents found inside richGridRenderer");
                } else {
                    console.log(`Found ${gridContents.length} items in richGridRenderer.contents`);
                    if (gridContents.length > 0) {
                        const firstItem = gridContents[0];
                        console.log("First item keys:", Object.keys(firstItem));
                        if (firstItem.richItemRenderer) {
                            console.log("Has richItemRenderer. Content keys:", Object.keys(firstItem.richItemRenderer.content));
                            const videoRenderer = firstItem.richItemRenderer.content.videoRenderer;
                            if (videoRenderer) {
                                console.log("Has videoRenderer! Keys:");
                                console.log(Object.keys(videoRenderer));
                                console.log("Published Time raw format:", videoRenderer.publishedTimeText?.simpleText || videoRenderer.publishedTimeText);
                            } else {
                                console.log("No videoRenderer in richItemRenderer!");
                            }
                        }
                    }
                }
            } else if (content.sectionListRenderer) {
                console.log("Has sectionListRenderer instead of richGridRenderer!");
            } else {
                console.log("Unknown renderer type.");
            }
        });
    });
}

checkVideosTab();
