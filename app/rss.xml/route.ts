import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/actions/article-actions';
import { getCategorySlug } from '@/lib/helpers';

const SITE_URL = 'https://tinthethao24h.com';
const SITE_NAME = 'Tin Thể Thao 24h';
const SITE_DESCRIPTION = 'Cập nhật tin tức bóng đá, thể thao mới nhất 24/7. Kết quả, lịch thi đấu, chuyển nhượng, Ngoại hạng Anh và các giải đấu hàng đầu.';

export const revalidate = 600; // 10 minutes

export async function GET() {
    let articles: any[] = [];
    try {
        // Get the latest 30 published articles
        articles = await getArticles('published', undefined, 1, 30);
    } catch (error) {
        console.error('RSS Feed: Failed to fetch articles', error);
    }

    const xmlItems = articles
        .map((art: any) => {
            const url = `${SITE_URL}/${getCategorySlug(art.category)}/${art.slug}`;
            const title = (art.translatedTitle || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const description = art.translatedContent
                ? art.translatedContent.replace(/<[^>]*>/g, '').substring(0, 300) + '...'
                : '';
            const pubDate = new Date(art.createdAt).toUTCString();

            return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <category>${art.category}</category>
      ${art.imageUrl ? `<media:content url="${art.imageUrl}" medium="image" xmlns:media="http://search.yahoo.com/mrss/" />` : ''}
    </item>`;
        })
        .join('\n');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE_NAME}</title>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>vi-VN</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
    });
}
