/** @type {import('next').NextConfig} */
const nextConfig = {

    // ─── Security Headers ───────────────────────────────────────────────────
    async headers() {
        return [
            {
                // Apply security headers to ALL routes
                source: '/(.*)',
                headers: [
                    // Prevent clickjacking - no iframes from other domains
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    // Block MIME type sniffing
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    // Control referrer info sent with requests
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    // Restrict browser features
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                    },
                    // Force HTTPS (HSTS) - 1 year, include subdomains
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    // XSS Protection for older browsers
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    // Content Security Policy
                    // Allows: same-origin, Google Fonts, Google Analytics, AdSense, YouTube embeds
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://adservice.google.com https://api.telegram.org",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: blob: https: http:",
                            "media-src 'self' https: blob:",
                            "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
                            "connect-src 'self' https://www.google-analytics.com https://api.telegram.org",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                        ].join('; '),
                    },
                ],
            },
            {
                // Don't cache API responses by default (let each route control its own)
                source: '/api/(.*)',
                headers: [
                    { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
                ],
            },
        ];
    },

    // ─── Redirects ──────────────────────────────────────────────────────────
    async redirects() {
        return [];
    },
};

export default nextConfig;
