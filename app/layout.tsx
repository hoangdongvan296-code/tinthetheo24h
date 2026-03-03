import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";
import { getSettings } from '../lib/actions/settings-actions';

const SITE_URL = 'https://tinthethao24h.com';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Tin Thể Thao 24h - Bóng đá, Thể thao cập nhật liên tục',
        template: '%s | Tin Thể Thao 24h',
    },
    description: 'Cập nhật tin tức bóng đá, thể thao mới nhất 24/7. Kết quả, lịch thi đấu, chuyển nhượng, Ngoại hạng Anh, La Liga, Champions League và các giải đấu hàng đầu thế giới.',
    keywords: ['bóng đá', 'thể thao', 'tin tức bóng đá', 'kết quả bóng đá', 'lịch thi đấu', 'chuyển nhượng', 'ngoại hạng anh', 'la liga', 'champions league'],
    authors: [{ name: 'Tin Thể Thao 24h', url: SITE_URL }],
    creator: 'Tin Thể Thao 24h',
    publisher: 'Tin Thể Thao 24h',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url: SITE_URL,
        siteName: 'Tin Thể Thao 24h',
        title: 'Tin Thể Thao 24h - Bóng đá, Thể thao cập nhật liên tục',
        description: 'Cập nhật tin tức bóng đá, thể thao mới nhất 24/7.',
        images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: 'Tin Thể Thao 24h' }],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@tinthethao24h',
        creator: '@tinthethao24h',
        title: 'Tin Thể Thao 24h - Bóng đá cập nhật liên tục',
        description: 'Cập nhật tin tức bóng đá, thể thao mới nhất 24/7.',
    },
    alternates: {
        canonical: SITE_URL,
        languages: { 'vi-VN': SITE_URL },
    },
    icons: {
        icon: [
            { url: '/favicon.png', type: 'image/png' },
            { url: '/icon.png', type: 'image/png', sizes: '512x512' },
        ],
        apple: [
            { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcut: '/favicon.png',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getSettings();

    return (
        <html lang="vi" dir="ltr" suppressHydrationWarning>
            <head>
                {/* Preconnect: Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Preconnect: Image CDNs */}
                <link rel="preconnect" href="https://livesport-ott-images.ssl.cdn.cra.cz" />
                <link rel="preconnect" href="https://i.ytimg.com" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

                {/* PWA Manifest */}
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#FFD700" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

                {/* RSS Feed auto-discovery */}
                <link rel="alternate" type="application/rss+xml" title="Tin Thể Thao 24h RSS" href="https://tinthethao24h.com/rss.xml" />

                {/* Dynamic Favicon from Settings */}
                {settings.faviconUrl ? (
                    <>
                        <link rel="icon" href={settings.faviconUrl} />
                        <link rel="shortcut icon" href={settings.faviconUrl} />
                        <link rel="apple-touch-icon" href={settings.faviconUrl} />
                    </>
                ) : (
                    <>
                        <link rel="icon" href="/favicon.png" type="image/png" />
                        <link rel="apple-touch-icon" href="/favicon.png" />
                    </>
                )}

                {/* Google Analytics */}
                {settings.googleAnalyticsId && (
                    <>
                        <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`} />
                        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.googleAnalyticsId}',{page_path:window.location.pathname});` }} />
                    </>
                )}

                {/* Google Search Console Verification */}
                {settings.googleSiteVerification && (
                    <meta name="google-site-verification" content={settings.googleSiteVerification} />
                )}

                {/* Google AdSense */}
                {settings.adsenseEnabled && settings.adsensePublisherId && (
                    <script
                        async
                        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsensePublisherId}`}
                        crossOrigin="anonymous"
                    />
                )}

            </head>
            <body>
                {/* Custom Body Start Code */}
                {settings.customHeaderCode && (
                    <div id="custom-header-injection" dangerouslySetInnerHTML={{ __html: settings.customHeaderCode }} style={{ display: 'none' }} />
                )}
                {settings.customBodyStartCode && (
                    <div id="custom-body-start-injection" dangerouslySetInnerHTML={{ __html: settings.customBodyStartCode }} />
                )}

                {/* Semantic H1 for Homepage SEO (hidden from view but available to search engines) */}
                <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
                    {settings.brandName || settings.siteName || "Tin Thể Thao 24h"} - {settings.brandSlogan || "Bóng đá cập nhật 24/7"}
                </h1>

                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": settings.brandName || settings.siteName || "Tin Thể Thao 24h",
                        "url": settings.siteUrl || SITE_URL,
                        "logo": {
                            "@type": "ImageObject",
                            "url": settings.schemaLogo || settings.faviconUrl || `${SITE_URL}/logo.png`,
                        },
                        "foundingDate": "2024",
                        "description": settings.brandDescription || "Hệ thống cập nhật tin tức bóng đá, thể thao tự động từ các nguồn uy tín thế giới.",
                        "email": settings.footerEmail || "info@tinthethao24h.com",
                        "inLanguage": "vi-VN",
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "editorial",
                            "email": settings.footerEmail || "info@tinthethao24h.com",
                            "availableLanguage": "Vietnamese"
                        }
                    })
                }} />
                <main>{children}</main>
                <Footer />

                {/* Custom Body End Code */}
                {settings.customBodyEndCode && (
                    <div dangerouslySetInnerHTML={{ __html: settings.customBodyEndCode }} />
                )}
            </body>
        </html>
    );
}
