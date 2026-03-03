import { getSettings } from '@/lib/actions/settings-actions';
import SettingsForm from './SettingsForm';

export const metadata = {
    title: 'Cài đặt chung - Admin',
};

export default async function SettingsPage() {
    const settings = await getSettings();

    const initialData = {
        logoText: settings.logoText || 'Tin Thể Thao 24h',
        logoUrl: settings.logoUrl || '',
        faviconUrl: settings.faviconUrl || '',
        footerAbout: settings.footerAbout || '',
        footerEmail: settings.footerEmail || 'info@tinthethao24h.com',
        // SEO fields
        googleAnalyticsId: settings.googleAnalyticsId || '',
        googleSiteVerification: settings.googleSiteVerification || '',
        defaultOgImage: settings.defaultOgImage || '',
        twitterHandle: settings.twitterHandle || '@tinthethao24h',
        siteUrl: settings.siteUrl || 'https://tinthethao24h.com',
        siteName: settings.siteName || 'Tin Thể Thao 24h',
        // Schema & SEO
        schemaLogo: settings.schemaLogo || 'https://tinthethao24h.com/logo.png',
        brandName: settings.brandName || 'Tin Thể Thao 24h',
        brandSlogan: settings.brandSlogan || 'Bóng đá, Thể thao cập nhật liên tục 24/7',
        brandDescription: settings.brandDescription || 'Hệ thống cập nhật tin tức bóng đá tự động từ các nguồn uy tín thế giới.',
        customHeaderCode: settings.customHeaderCode || '',
        customBodyStartCode: settings.customBodyStartCode || '',
        customBodyEndCode: settings.customBodyEndCode || '',
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                Cài đặt chung
            </h1>

            <div style={{ maxWidth: '800px', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <SettingsForm initialData={initialData} />
            </div>
        </div>
    );
}
