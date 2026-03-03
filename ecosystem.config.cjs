// pm2 ecosystem config — chạy cron worker trên VPS
// Sử dụng: pm2 start ecosystem.config.cjs

module.exports = {
    apps: [
        // ── Next.js Web App ────────────────────────────────────────────
        {
            name: 'bongda-web',
            script: 'node_modules/.bin/next',
            args: 'start',
            cwd: './',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            // Auto-restart if crashes
            autorestart: true,
            max_restarts: 10,
            restart_delay: 5000,
            // Logs
            out_file: './logs/web-out.log',
            error_file: './logs/web-error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
        },

        // ── Cron Worker ───────────────────────────────────────────────
        {
            name: 'bongda-cron',
            script: 'cron.js',
            cwd: './',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
            },
            autorestart: true,
            max_restarts: 10,
            restart_delay: 10000,
            // Logs
            out_file: './logs/cron-out.log',
            error_file: './logs/cron-error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            // Limit log file sizes
            log_file: './logs/cron-combined.log',
        },
    ],
};
