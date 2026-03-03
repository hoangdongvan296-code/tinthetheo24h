export async function generateSitemap(posts: any[]) {
    const baseUrl = 'https://bongda2026auto.com';

    const staticPages = [
        '',
        '/chuyen-nhuong',
        '/lich-thi-dau',
        '/soi-keo',
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <changefreq>daily</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
  ${posts.map(post => `
    <url>
      <loc>${baseUrl}/tin-tuc/${post.slug}</loc>
      <lastmod>${new Date(post.createdAt).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>
  `).join('')}
</urlset>`;

    return sitemap;
}
