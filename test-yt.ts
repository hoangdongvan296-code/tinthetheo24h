async function fetchYouTubeVideos(handle: string) {
    try {
        const url = `https://www.youtube.com/${handle}/videos`;
        console.log(`Fetching ${url}...`);
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        const html = await res.text();

        // Find ytInitialData
        const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
        if (!match) {
            console.log('No ytInitialData found');
            return;
        }

        const data = JSON.parse(match[1]);

        // Dig into data
        // contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents[0].richItemRenderer.content.videoRenderer
        let tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs;
        if (!tabs) return console.log('No tabs');

        let videosTab = tabs.find((t: any) => t.tabRenderer?.title === 'Videos' || t.tabRenderer?.endpoint?.commandMetadata?.webCommandMetadata?.url?.includes('/videos'));
        if (!videosTab) videosTab = tabs[1];

        const contents = videosTab?.tabRenderer?.content?.richGridRenderer?.contents;
        if (!contents) return console.log('No video contents');

        const videos = contents
            .map((c: any) => c.richItemRenderer?.content?.videoRenderer)
            .filter(Boolean)
            .slice(0, 3)
            .map((v: any) => ({
                id: v.videoId,
                title: v.title?.runs?.[0]?.text,
                thumbnail: v.thumbnail?.thumbnails?.[0]?.url,
                publishedTimeText: v.publishedTimeText?.simpleText
            }));

        console.log(`--- ${handle} ---`);
        console.log(JSON.stringify(videos, null, 2));

    } catch (e) {
        console.error('Error fetching ' + handle, e);
    }
}

fetchYouTubeVideos('@tv360vtt');
