import { getKeywords } from '../actions/keyword-actions';

export interface KeywordLink {
    keyword: string;
    url: string;
}

// Initial set of keywords for internal linking (fallback)
export const DEFAULT_KEYWORDS: KeywordLink[] = [
    { keyword: 'Man Utd', url: '/clb/manchester-united' },
    { keyword: 'Manchester United', url: '/clb/manchester-united' },
    { keyword: 'Arsenal', url: '/clb/arsenal' },
    { keyword: 'Liverpool', url: '/clb/liverpool' },
    { keyword: 'Man City', url: '/clb/manchester-city' },
    { keyword: 'Real Madrid', url: '/clb/real-madrid' },
    { keyword: 'Barcelona', url: '/clb/barcelona' },
    { keyword: 'Haaland', url: '/cau-thu/erling-haaland' },
    { keyword: 'Mbappe', url: '/cau-thu/kylian-mbappe' },
    { keyword: 'Chuyển nhượng', url: '/chuyen-nhuong' },
    { keyword: 'Ngoại hạng Anh', url: '/ngoai-hang-anh' },
    { keyword: 'Cúp C1', url: '/cup-c1' },
];

export async function injectInternalLinks(content: string, providedKeywords?: KeywordLink[]): Promise<string> {
    if (!content) return '';
    let linkedContent = content;

    // Fetch from database if not provided
    let keywords = providedKeywords;
    if (!keywords) {
        const dbKeywords = await getKeywords();
        keywords = dbKeywords.length > 0 ? dbKeywords : DEFAULT_KEYWORDS;
    }

    // Sort keywords by length descending to match longer phrases first
    const sortedKeywords = [...keywords!].sort((a, b) => b.keyword.length - a.keyword.length);

    for (const item of sortedKeywords) {
        const escapedKeyword = item.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!<[^>]*)\\b${escapedKeyword}\\b(?![^<]*>)`, 'gi'); // Case-insensitive and global

        let count = 0;
        linkedContent = linkedContent.replace(regex, (match) => {
            if (count === 0) {
                count++;
                return `<a href="${item.url}" class="internal-link">${match}</a>`;
            }
            return match;
        });
    }

    return linkedContent;
}
