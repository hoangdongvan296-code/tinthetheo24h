/**
 * Telegram Bot integration for auto-posting new articles.
 * Activated when TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID env vars are set.
 * 
 * Setup:
 * 1. Create a bot via @BotFather on Telegram → get bot token
 * 2. Create your channel, add the bot as admin
 * 3. Get the Chat ID of your channel (e.g., @yourchannel or -100xxxxxxxxx)
 * 4. Add to .env.local: TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=...
 */

export interface TelegramPostOptions {
    title: string;
    url: string;
    summary: string;
    category?: string;
    imageUrl?: string;
}

export async function postToTelegram(options: TelegramPostOptions): Promise<boolean> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.log('[Telegram] Skipping: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set.');
        return false;
    }

    const { title, url, summary, category, imageUrl } = options;
    const categoryTag = category ? `#${category.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}` : '';

    // Format message in Telegram MarkdownV2
    const escape = (text: string) => text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');

    const message = `🏆 *${escape(title)}*\n\n📝 ${escape(summary.substring(0, 200))}\\.\\.\\.\n\n🔗 [Đọc toàn bài](${url})\n\n${categoryTag} \\#BóngĐá \\#ThểThao`;

    try {
        // If imageUrl available, send photo with caption
        if (imageUrl) {
            const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    photo: imageUrl,
                    caption: message,
                    parse_mode: 'MarkdownV2',
                }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.description || 'Unknown Telegram error');
            console.log(`[Telegram] ✅ Photo post sent: ${title}`);
        } else {
            const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'MarkdownV2',
                    disable_web_page_preview: false,
                }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.description || 'Unknown Telegram error');
            console.log(`[Telegram] ✅ Message sent: ${title}`);
        }
        return true;
    } catch (error: any) {
        console.error(`[Telegram] ❌ Failed to send post: ${error.message}`);
        return false;
    }
}

export async function pushToSocial(title: string, url: string, summary: string, options?: { category?: string; imageUrl?: string }) {
    console.log(`[Social Pilot] Dispatching: ${title}`);

    const telegramSuccess = await postToTelegram({
        title,
        url,
        summary,
        category: options?.category,
        imageUrl: options?.imageUrl,
    });

    // Facebook — placeholder (requires Meta Business API approval)
    const fbAccessToken = process.env.FB_ACCESS_TOKEN;
    if (fbAccessToken) {
        console.log('[Facebook] TODO: Implement Facebook Page post integration.');
    }

    return { telegram: telegramSuccess };
}
