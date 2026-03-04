/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   BONGDA 2026 - VPS CRON WORKER                             ║
 * ║   Chạy bằng: node cron.js hoặc pm2 start cron.js           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * LỊCH TRÌNH:
 *   📰 Tin tức : Mỗi 2 giờ (0,2,4,6,8,10,12,14,16,18,20,22 giờ)
 *                → 8 danh mục, tối đa 2 bài mới/danh mục, chỉ hôm nay
 *   🎬 Video   : Mỗi 3 giờ (1,4,7,10,13,16,19,22 giờ)
 *                → Tất cả kênh YT, chỉ video đăng hôm nay
 *
 * VPS SETUP:
 *   npm install node-cron   (nếu chưa có)
 *   pm2 start cron.js --name "bongda-cron"
 *   pm2 save && pm2 startup
 */

'use strict';

// Load .env.local — bắt buộc để lấy ADMIN_PASSWORD chính xác trên VPS
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const cron = require('node-cron');

// ── Config ────────────────────────────────────────────────────────────────
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const USER = process.env.ADMIN_USERNAME || 'admin';
const PASS = process.env.ADMIN_PASSWORD;

if (!PASS) {
    console.error('[CRON] ❌ Lỗi: Không tìm thấy ADMIN_PASSWORD trong .env.local!');
    process.exit(1);
}

const AUTH_B64 = Buffer.from(`${USER}:${PASS}`).toString('base64');

const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${AUTH_B64}`,
};

// ── Helpers ───────────────────────────────────────────────────────────────
function timestamp() {
    return new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

function log(type, msg) {
    const icon = type === 'ERROR' ? '❌' : type === 'WARN' ? '⚠️ ' : '✅';
    console.log(`[${timestamp()}] ${icon} [${type}] ${msg}`);
}

async function callApi(endpoint, label) {
    const url = `${APP_URL}${endpoint}`;
    log('INFO', `${label} → POST ${url}`);

    try {
        const res = await fetch(url, { method: 'POST', headers: HEADERS });
        const body = await res.json().catch(() => ({}));

        if (res.ok) {
            log('INFO', `${label} ← OK (${res.status}): ${body.message || 'đã khởi chạy'}`);
        } else if (res.status === 409) {
            log('WARN', `${label} ← Đang chạy rồi, bỏ qua lần này.`);
        } else {
            log('ERROR', `${label} ← Lỗi (${res.status}): ${body.message || res.statusText}`);
        }
    } catch (err) {
        log('ERROR', `${label} ← Không kết nối được: ${err.message}`);
    }
}

// ── Job Definitions ───────────────────────────────────────────────────────

/**
 * 📰 Crawl Tin Tức — chạy mỗi 2 giờ
 *   Cron: "0 0,2,4,6,8,10,12,14,16,18,20,22 * * *"
 *   = vào đúng phút 0 của các giờ chẵn mỗi ngày
 */
cron.schedule('0 0,2,4,6,8,10,12,14,16,18,20,22 * * *', async () => {
    log('INFO', '⏰ JOB: Crawl Tin Tức bắt đầu...');
    await callApi('/api/admin/crawler/start', '📰 Tin tức');
}, {
    timezone: 'Asia/Ho_Chi_Minh'
});

/**
 * 🎬 Crawl Video — chạy mỗi 3 giờ (lệch giờ với tin tức)
 *   Cron: "0 1,4,7,10,13,16,19,22 * * *"
 *   = vào đúng phút 0 của 1h, 4h, 7h, ... mỗi ngày
 */
cron.schedule('0 1,4,7,10,13,16,19,22 * * *', async () => {
    log('INFO', '⏰ JOB: Crawl Video bắt đầu...');
    await callApi('/api/admin/crawler/videos', '🎬 Video');
}, {
    timezone: 'Asia/Ho_Chi_Minh'
});

// ── Boot message ─────────────────────────────────────────────────────────
console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   🤖  BONGDA 2026 — CRON WORKER STARTED          ║');
console.log('╚══════════════════════════════════════════════════╝');
console.log(`Server : ${APP_URL}`);
console.log(`Tin tức: mỗi 2 giờ (0,2,4...22h) — 8 danh mục, max 2 bài/danh mục, chỉ hôm nay`);
console.log(`Video  : mỗi 3 giờ (1,4,7...22h) — tất cả kênh YT, chỉ video hôm nay`);
console.log('Đang chờ lịch... (Ctrl+C để dừng)\n');
