export function getCategorySlug(categoryName: string): string {
    if (!categoryName) return 'tin-tuc';

    // Map of specific known categories to their exact slugs
    const categoryMap: Record<string, string> = {
        'Ngoại hạng Anh': 'ngoai-hang-anh',
        'Champions League': 'champions-league',
        'La Liga': 'la-liga',
        'Bundesliga': 'bundesliga',
        'Serie A': 'serie-a',
        'Ligue 1': 'ligue-1',
        'Europa League': 'europa-league',
        'Chuyển nhượng': 'chuyen-nhuong',
        'Tin tức': 'tin-tuc',
        'Video': 'video',
        'Lịch thi đấu': 'lich-thi-dau'
    };

    // Return the mapped slug if found
    if (categoryMap[categoryName]) {
        return categoryMap[categoryName];
    }
    if (categoryMap[categoryName.trim()]) {
        return categoryMap[categoryName.trim()];
    }

    return slugify(categoryName) || 'tin-tuc';
}

export function slugify(text: string): string {
    if (!text) return '';

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, '-');
}

export function capitalizeEachWord(text: string): string {
    if (!text) return '';
    return text
        .toLowerCase()
        .split(/[-\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
