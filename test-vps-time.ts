import { scrapeChannelVideos } from './lib/crawler/youtube-scraper';

async function runTest() {
    console.log("=== KIỂM TRA CHUỖI THỜI GIAN TRÊN VPS ===");
    try {
        const videos = await scrapeChannelVideos('@tv360vtt');
        console.log(`Tìm thấy ${videos.length} video trên giao diện trang channel.`);

        if (videos.length > 0) {
            console.log("\n5 video mới nhất và chuỗi thời gian chưa qua bộ lọc:");
            videos.slice(0, 5).forEach((v, index) => {
                console.log(`[${index + 1}] Tiêu đề: ${v.title.substring(0, 40)}...`);
                console.log(`    THỜI GIAN RAW: '${v.publishedTimeText}'`);
            });
            console.log("\n=========================");
        } else {
            console.log("Không parse được video nào từ mảng JSON ytInitialData.");
        }
    } catch (e) {
        console.error("Lỗi:", e);
    }
}

runTest();
