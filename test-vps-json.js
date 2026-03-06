const https = require('https');
const fs = require('fs');

async function checkJsonStructure() {
    console.log("Fetching YouTube HTML from VPS to extract ytInitialData...");
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
            if (!match) {
                console.log("Không tìm thấy ytInitialData trong file HTML. Regex có thể sai trên VPS.");
                fs.writeFileSync('vps-html-dump.txt', html.substring(0, 10000)); // dump first 10kb
                console.log("Đã dump 10kb đầu tiên ra vps-html-dump.txt");
                return;
            }

            try {
                const data = JSON.parse(match[1]);
                console.log("Đã parse JSON ytInitialData thành công!");

                // Let's deeply log the keys of the contents array
                const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs;
                if (!tabs) {
                    console.log("Cấu trúc JSON bị thay đổi: Không có data.contents.twoColumnBrowseResultsRenderer.tabs");
                    // Print top level keys to see what we got
                    console.log("Top level keys:", Object.keys(data));
                    if (data.contents) {
                        console.log("Contents keys:", Object.keys(data.contents));
                    }
                    fs.writeFileSync('vps-json-dump.txt', JSON.stringify(data, null, 2));
                    console.log("Đã dump toàn bộ JSON ra file vps-json-dump.txt");
                    return;
                }

                console.log(`Tìm thấy ${tabs.length} tabs.`);
                tabs.forEach((t, i) => {
                    console.log(`Tab ${i}: Title = ${t.tabRenderer?.title}`);
                });

            } catch (e) {
                console.log("Lỗi parse JSON:", e.message);
            }
        });
    });
}

checkJsonStructure();
