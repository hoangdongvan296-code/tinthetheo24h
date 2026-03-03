import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/actions/article-actions';
import { getCategorySlug } from '@/lib/helpers';

const SITE_URL = 'https://tinthethao24h.com';

const STATIC_PAGES = [
    { url: '/', priority: 1.0, changeFrequency: 'hourly' as const },
    { url: '/ngoai-hang-anh', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/champions-league', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/europa-league', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/la-liga', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/bundesliga', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/serie-a', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/ligue-1', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/chuyen-nhuong', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/video', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/lich-thi-dau', priority: 0.9, changeFrequency: 'hourly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
        url: `${SITE_URL}${page.url}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));

    // Dynamic article pages
    let articleEntries: MetadataRoute.Sitemap = [];
    try {
        const articles = await getArticles('published');
        articleEntries = articles
            .filter((art: any) => art.slug && art.category)
            .map((art: any) => ({
                url: `${SITE_URL}/${getCategorySlug(art.category)}/${art.slug}`,
                lastModified: art.updatedAt ? new Date(art.updatedAt) : new Date(art.createdAt),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
    } catch (error) {
        console.error('Sitemap: Failed to fetch articles', error);
    }

    return [...staticEntries, ...articleEntries];
}
