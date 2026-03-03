// /sitemap-news.xml — alias for /sitemap-news (matches robots.txt)
// This route is required because robots.txt lists sitemap-news.xml
import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/actions/article-actions';
import { getCategorySlug } from '@/lib/helpers';

const SITE_URL = 'https://tinthethao24h.com';
const SITE_NAME = 'Tin Thể Thao 24h';

export const revalidate = 300;

export async function GET() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    let articles: any[] = [];
    try {
        const allArticles = await getArticles('published');
        articles = allArticles.filter((art: any) => {
            const createdAt = new Date(art.createdAt);
            return createdAt >= twoDaysAgo && art.slug && art.category;
        });
    } catch (error) {
        console.error('News sitemap (.xml): failed to fetch articles', error);
    }

    const xmlItems = articles
        .map((art: any) => {
            const pubDate = new Date(art.createdAt).toISOString();
            const url = `${SITE_URL}/${getCategorySlug(art.category)}/${art.slug}`;
            const title = (art.translatedTitle || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const keywords = [art.category, 'bóng đá', 'thể thao'].join(', ');

            return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_NAME}</news:name>
        <news:language>vi</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
      <news:keywords>${keywords}</news:keywords>
    </news:news>
  </url>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlItems}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
    });
}
