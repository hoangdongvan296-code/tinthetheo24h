const https = require('https');

async function checkYoutube() {
    console.log("Checking YouTube HTML from this server...");
    const url = 'https://www.youtube.com/@tv360vtt/videos';

    https.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Status Code: ${res.statusCode}`);
            const hasYtData = data.includes('var ytInitialData');
            console.log(`Contains ytInitialData? ${hasYtData}`);

            if (!hasYtData) {
                console.log("Saving output to /tmp/yt-debug.html to inspect...");
                require('fs').writeFileSync('/tmp/yt-debug.html', data);

                // Print the title of the page to see if it's a captcha or consent
                const titleMatch = data.match(/<title>(.*?)<\/title>/);
                if (titleMatch) {
                    console.log(`Page Title: ${titleMatch[1]}`);
                }
            } else {
                console.log("YouTube data is present! The issue is elsewhere.");
            }
        });
    }).on('error', (err) => {
        console.error("Error fetching:", err.message);
    });
}

checkYoutube();
