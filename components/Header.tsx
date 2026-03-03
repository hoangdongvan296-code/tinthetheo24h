import Link from 'next/link';
import Nav from './Nav';
import HeaderActions from './HeaderActions';
import { getSettings } from '@/lib/actions/settings-actions';

export default async function Header() {
    const settings = await getSettings();

    return (
        <header style={{
            background: 'var(--nav-bg)',
            color: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem 1.5rem'
            }}>
                <div style={{ flexShrink: 0 }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt={settings.logoText || 'Logo'} style={{ maxHeight: '45px', objectFit: 'contain' }} />
                        ) : (
                            <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--primary-color)', letterSpacing: '-1px' }}>
                                {settings.logoText || 'TINTHE THAO 24H'}
                            </span>
                        )}
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', gap: '1rem' }}>
                    <Nav />
                    <HeaderActions />
                </div>
            </div>

            <div style={{ background: 'var(--primary-color)', height: '2px', opacity: 0.8 }}></div>
        </header>
    );
}


