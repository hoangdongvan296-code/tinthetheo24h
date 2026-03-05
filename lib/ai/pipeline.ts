import { scrapeCategory, scrapeArticleContent } from '../crawler/scraper';
import { translateArticle } from '../ai/translator';
import { injectInternalLinks } from '../ai/linking-engine';
import { notifyGoogleIndexing } from '../actions/indexing-actions';
import { pushToSocial } from '../automation/social-pilot';
import { getNextAuthorForArticle } from '../actions/author-actions';
import { getCategorySlug } from '../helpers';
import { getDb } from '../mongodb';
import { revalidatePath } from 'next/cache';

import { slugify } from '../helpers';

export interface FullArticle {
    originalTitle: string;
    originalUrl: string;
    translatedTitle: string;
    translatedContent: string;
    imageUrl?: string;
    category: string;
    status: 'draft' | 'published' | 'trash';
    createdAt: Date;
    slug?: string;
    authorName?: string;
    authorRole?: string;
    authorAvatar?: string;
    authorId?: string;
}

export async function processArticle(
    categoryUrl: string,
    categoryName: string
): Promise<FullArticle | null> {
    console.log(`Step 1: Scraping category ${categoryName}...`);
    const articles = await scrapeCategory(categoryUrl, categoryName);

    if (articles.length === 0) {
        console.log('No articles found in category.');
        return null;
    }

    // Process the first article for testing
    return processSingleArticle(articles[0]);
}

export async function processSingleArticle(scraped: any): Promise<FullArticle | null> {
    console.log(`--- Processing Article: ${scraped.title} ---`);
    console.log(`Step 2: Scraping content...`);
    const { content, imageUrl } = await scrapeArticleContent(scraped.url);

    if (!content) {
        console.log('No content found in article.');
        return null;
    }

    console.log('Step 3: Translating with OpenRouter (AI)...');
    const translation = await translateArticle(scraped.title, content);

    console.log('Step 4: Injecting Internal Links (SEO)...');
    const linkedContent = await injectInternalLinks(translation.translatedContent);

    // Generate Vietnamese slug from translated title
    const baseSlug = slugify(translation.translatedTitle) || slugify(scraped.title);

    // Ensure slug uniqueness in DB
    let slug = baseSlug;
    try {
        const db = await getDb();
        const existing = await db.collection('articles').findOne({ slug: baseSlug });
        if (existing && existing.originalUrl !== scraped.url) {
            // Append short timestamp suffix to avoid collision
            slug = `${baseSlug}-${Date.now().toString(36)}`;
        }
    } catch { /* slug uniqueness check failed, use base */ }

    // Assign author via round-robin from the authors pool
    let authorName = 'Tin Thể Thao 24h';
    let authorRole = 'Biên tập viên';
    let authorAvatar = '/author-avatar.png';
    let authorId: string | undefined;
    try {
        const author = await getNextAuthorForArticle();
        if (author) {
            authorName = author.name;
            authorRole = author.role;
            authorAvatar = author.avatar || '/author-avatar.png';
            authorId = author._id?.toString();
            console.log(`[Pipeline] Assigned author: ${authorName}`);
        }
    } catch (e) {
        console.warn('[Pipeline] Could not assign author, using default.');
    }

    const finalArticle: FullArticle = {
        originalTitle: scraped.title,
        originalUrl: scraped.url,
        translatedTitle: translation.translatedTitle,
        translatedContent: linkedContent,
        imageUrl: imageUrl || scraped.imageUrl,
        category: scraped.category,
        status: 'published',
        createdAt: new Date(),
        slug: slug,
        authorName,
        authorRole,
        authorAvatar,
        ...(authorId ? { authorId } : {}),
    } as any;

    console.log('Step 5: Saving to MongoDB...');
    try {
        const db = await getDb();
        const collection = db.collection('articles');

        // Check if URL already exists to avoid duplicates
        const exists = await collection.findOne({ originalUrl: finalArticle.originalUrl });
        if (exists) {
            console.log('Article already exists in database. Skipping save.');
            return { duplicate: true } as any;
        }

        await collection.insertOne(finalArticle);
        console.log('Successfully saved to database.');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
    }

    console.log('Pipeline finished successfully.');

    // Trigger Google Indexing API if it was saved as published
    if (finalArticle.status === 'published' && finalArticle.slug && finalArticle.category) {
        const url = `https://tinthethao24h.com/${getCategorySlug(finalArticle.category)}/${finalArticle.slug}`;
        await notifyGoogleIndexing(url);

        // Auto-post to Telegram channel
        const plainText = (finalArticle.translatedContent || '').replace(/<[^>]*>/g, '').trim();
        await pushToSocial(
            finalArticle.translatedTitle,
            url,
            plainText,
            { category: finalArticle.category, imageUrl: finalArticle.imageUrl }
        );

        // Revalidate public pages for the new article
        revalidatePath('/');
        revalidatePath(`/${getCategorySlug(finalArticle.category)}`);
    }

    return finalArticle;
}
