import { ObjectId } from 'mongodb';

export interface SiteSettings {
    _id: string | ObjectId; // Allow both string and ObjectId for flexibility
    // Branding
    logoText: string;
    logoUrl: string;
    faviconUrl: string;
    // Footer
    footerAbout: string;
    footerEmail: string;
    // Schema & SEO
    schemaLogo: string;
    brandName: string;
    brandSlogan: string;
    brandDescription: string;
    googleAnalyticsId: string;
    googleSiteVerification: string;
    defaultOgImage: string;
    twitterHandle: string;
    siteUrl: string;
    siteName: string;
    // Custom Code Snippets
    customHeaderCode?: string;
    customBodyStartCode?: string;
    customBodyEndCode?: string;
    // AdSense
    adsensePublisherId?: string;
    adsenseEnabled?: boolean;
    adsenseSlotHeader?: string;
    adsenseSlotInArticle?: string;
    adsenseSlotSidebar?: string;
    adsenseSlotFooter?: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
    _id: 'site-settings', // Using a string ID for easier management
    // Branding
    logoText: 'TINTHE THAO 24H',
    logoUrl: '/premium_sports_logo.png',
    faviconUrl: '/favicon.ico',

    // Footer
    footerAbout: 'Tinthethao24h.com - Hệ thống cập nhật tin tức bóng đá tự động từ các nguồn uy tín thế giới. Cung cấp thông tin nhanh chóng và chính xác nhất cho người hâm mộ Việt Nam.',
    footerEmail: 'info@bongda2026.com',
    // Schema & SEO
    schemaLogo: 'https://tinthethao24h.com/logo.png',
    brandName: 'Tin Thể Thao 24h',
    brandSlogan: 'Bóng đá, Thể thao cập nhật liên tục 24/7',
    brandDescription: 'Hệ thống cập nhật tin tức bóng đá tự động từ các nguồn uy tín thế giới. Cung cấp thông tin nhanh chóng và chính xác nhất cho người hâm mộ Việt Nam.',
    googleAnalyticsId: '',
    googleSiteVerification: '',
    defaultOgImage: '',
    twitterHandle: '@tinthethao24h',
    siteUrl: 'https://tinthethao24h.com',
    siteName: 'Tin Thể Thao 24h',
    // Custom Code Snippets
    customHeaderCode: '',
    customBodyStartCode: '',
    customBodyEndCode: '',
    // AdSense
    adsensePublisherId: '',
    adsenseEnabled: false,
    adsenseSlotHeader: '',
    adsenseSlotInArticle: '',
    adsenseSlotSidebar: '',
    adsenseSlotFooter: '',
};
