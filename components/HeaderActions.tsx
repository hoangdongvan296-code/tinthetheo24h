"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

export default function HeaderActions() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
            <button
                onClick={() => setIsSearchOpen(true)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', transition: 'all 0.2s' }}
                aria-label="Tìm kiếm"
            >
                <Search size={22} />
            </button>

            {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
        </div>
    );
}

