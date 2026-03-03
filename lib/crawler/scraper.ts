import * as cheerio from 'cheerio';

export interface ScrapedArticle {
    title: string;
    url: string;
    imageUrl?: string;
    excerpt?: string;
    category: string;
}

export async function scrapeCategory(categoryUrl: string, categoryName: string): Promise<ScrapedArticle[]> {
    try {
        const response = await fetch(categoryUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await response.text();

        const $ = cheerio.load(html);
        const articles: ScrapedArticle[] = [];

        // Tribal Football article selectors
        // Container is an <a> tag with class starting with wcl-article
        $('a[class*="wcl-article"]').each((_, element) => {
            const $el = $(element);
            const titleEl = $el.find('[class*="wcl-headline"], [role="heading"]').first();
            const title = titleEl.text().trim();
            let url = $el.attr('href');

            if (url && !url.startsWith('http')) {
                url = `https://www.tribalfootball.com${url}`;
            }

            let imageUrl = $el.find('figure img, picture img').attr('src');
            if (imageUrl && (imageUrl.toLowerCase().includes('logo') || imageUrl.toLowerCase().includes('icon'))) {
                imageUrl = undefined;
            }

            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = `https://www.tribalfootball.com${imageUrl}`;
            }

            const excerpt = "No excerpt available"; // List view doesn't have excerpts

            if (title && url) {
                articles.push({
                    title,
                    url,
                    imageUrl,
                    excerpt,
                    category: categoryName
                });
            }
        });

        return articles;
    } catch (error) {
        console.error(`Error scraping category ${categoryUrl}:`, error);
        return [];
    }
}

export async function scrapeArticleContent(articleUrl: string): Promise<{ content: string; imageUrl?: string }> {
    try {
        const response = await fetch(articleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        // Identify the best container by paragraph density
        const containerScores: any = {};
        $('p').each((_, el) => {
            const parent = $(el).parent();
            if (parent && parent.length > 0) {
                const tagName = parent.prop('tagName') || '';
                const className = parent.attr('class') ? '.' + (parent.attr('class') || '').split(' ').join('.') : '';
                const idName = parent.attr('id') ? '#' + parent.attr('id') : '';
                const sel = tagName + className + idName;
                containerScores[sel] = (containerScores[sel] || 0) + 1;
            }
        });

        const topSelector = Object.entries(containerScores).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];
        const contentContainer = topSelector ? $(topSelector) : $('article').first();

        // Multi-stage Hero Image Detection
        let imageUrl = $('meta[property="og:image"]').attr('content');
        const twitterImage = $('meta[name="twitter:image"]').attr('content');

        const isLogo = (url: string | undefined) => {
            if (!url) return true;
            const lurl = url.toLowerCase();
            return lurl.includes('logo') || lurl.includes('favicon') || lurl.includes('icon') || lurl.includes('og-image.jpg');
        };

        // If OG image is a logo or missing, try Twitter image
        if (isLogo(imageUrl) && twitterImage && !isLogo(twitterImage)) {
            imageUrl = twitterImage;
        }

        if (contentContainer.length === 0) {
            // Last resort: search entire page for any non-logo image
            if (isLogo(imageUrl)) {
                $('img').each((_, el) => {
                    const src = $(el).attr('src');
                    if (src && !isLogo(src) && !src.includes('data:image')) {
                        imageUrl = src;
                        return false; // break
                    }
                });
            }

            // Final absolute check
            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = new URL(imageUrl, articleUrl).href;
            }
            return { content: '', imageUrl };
        }

        // Clean up
        contentContainer.find('.advertisement, .related-posts, script, style, .social-share, footer, nav, aside, .comments, .wcl-ad, .wcl-share, .wcl-native-ad').remove();

        const blocks: string[] = [];

        // Traverse children to maintain order
        contentContainer.children().each((_, el) => {
            const $el = $(el);
            const tag = el.tagName?.toLowerCase();

            if (tag === 'p') {
                const text = $el.text().trim();
                // Filter out tiny snippets or social handles
                if (text.length > 20) {
                    blocks.push(text);
                }
            } else if (tag === 'img' || $el.find('img').length > 0) {
                const img = tag === 'img' ? $el : $el.find('img').first();
                let src = img.attr('src') || img.attr('data-src');
                if (src && !src.includes('data:image')) {
                    // Filter out logos from body text
                    if (isLogo(src)) return;

                    if (!src.startsWith('http')) {
                        src = new URL(src, articleUrl).href;
                    }
                    blocks.push(`[MEDIA_IMAGE: ${src} | ${img.attr('alt') || ''}]`);
                }
            } else if (tag === 'blockquote' || tag === 'iframe' || $el.hasClass('twitter-tweet')) {
                const outer = $.html($el);
                blocks.push(`[MEDIA_EMBED: ${outer}]`);
            }
        });

        // Fallback if no blocks were captured by direct children (e.g. shallow container)
        if (blocks.length === 0) {
            contentContainer.find('p').each((_, el) => {
                const text = $(el).text().trim();
                if (text.length > 20) blocks.push(text);
            });
        }

        const content = blocks.join('\n\n');

        // Final fallback for Hero Image if meta tags were bad
        if (isLogo(imageUrl)) {
            // Prefer the largest/first real image in the content
            const firstGoodImg = contentContainer.find('img').filter((_, el) => !isLogo($(el).attr('src'))).first();
            let firstSrc = firstGoodImg.attr('src') || firstGoodImg.attr('data-src');
            if (firstSrc) {
                if (!firstSrc.startsWith('http')) {
                    firstSrc = new URL(firstSrc, articleUrl).href;
                }
                imageUrl = firstSrc;
            }
        }

        // Ensure final URL is absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = new URL(imageUrl, articleUrl).href;
        }

        return { content, imageUrl };
    } catch (error) {
        console.error(`Error scraping article ${articleUrl}:`, error);
        return { content: '' };
    }
}
