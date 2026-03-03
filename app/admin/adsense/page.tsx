import { getSettings } from '@/lib/actions/settings-actions';
import AdsenseForm from './AdsenseForm';

export const metadata = {
    title: 'Cấu hình AdSense - Admin',
};

export default async function AdsensePage() {
    const settings = await getSettings();

    const initialData = {
        adsensePublisherId: settings.adsensePublisherId || '',
        adsenseEnabled: settings.adsenseEnabled ?? false,
        adsenseSlotHeader: settings.adsenseSlotHeader || '',
        adsenseSlotInArticle: settings.adsenseSlotInArticle || '',
        adsenseSlotSidebar: settings.adsenseSlotSidebar || '',
        adsenseSlotFooter: settings.adsenseSlotFooter || '',
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                💰 Cấu hình Google AdSense
            </h1>
            <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Nhập Publisher ID và Slot ID cho từng vị trí quảng cáo. Quảng cáo sẽ được hiển thị tự động sau khi lưu.
            </p>

            <div style={{ maxWidth: '900px', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <AdsenseForm initialData={initialData} />
            </div>
        </div>
    );
}
