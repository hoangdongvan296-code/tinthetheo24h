'use server';

import { getDb } from '../mongodb';
import { notifyGoogleIndexing } from './indexing-actions';
import { getCategorySlug } from '../helpers';


export async function getArticles(status?: string, category?: string, page: number = 1, limit: number = 1000) {
    try {
        const db = await getDb();
        const skip = (page - 1) * limit;

        let query: any = {};
        if (status) query.status = status;
        if (category) {
            // Flexible match for category
            query.category = { $regex: category, $options: 'i' };
        }

        const articles = await db
            .collection('articles')
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        return JSON.parse(JSON.stringify(articles)); // Serialize for client components
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

export async function getArticlesCount(status?: string, category?: string) {
    try {
        const db = await getDb();
        let query: any = {};
        if (status) query.status = status;
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        return await db.collection('articles').countDocuments(query);
    } catch (error) {
        console.error('Error fetching articles count:', error);
        return 0;
    }
}

export async function updateArticle(id: string, data: any) {
    try {
        const { ObjectId } = require('mongodb');
        const db = await getDb();
        const { _id, ...updateData } = data;

        // Round-robin author assignment when publishing for the first time
        if (updateData.status === 'published') {
            const existingArticle = await db.collection('articles').findOne({ _id: new ObjectId(id) });
            if (!existingArticle?.authorName) {
                // Lazy import to avoid circular deps
                const { getNextAuthorForArticle } = await import('./author-actions');
                const author = await getNextAuthorForArticle();
                if (author) {
                    updateData.authorName = author.name;
                    updateData.authorRole = author.role;
                    updateData.authorAvatar = author.avatar || '';
                    updateData.authorId = author._id;
                }
            }
        }

        await db.collection('articles').updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        // Notify Google Indexing API if published
        if (updateData.status === 'published') {
            const article = await db.collection('articles').findOne({ _id: new ObjectId(id) });
            if (article && article.slug && article.category) {
                const url = `https://tinthethao24h.com/${getCategorySlug(article.category)}/${article.slug}`;
                await notifyGoogleIndexing(url);
            }
        }

        return { success: true };

    } catch (error) {
        console.error('Error updating article:', error);
        return { success: false };
    }
}

export async function deleteArticle(id: string) {
    try {
        const { ObjectId } = require('mongodb');
        const db = await getDb();
        await db.collection('articles').deleteOne({ _id: new ObjectId(id) });

        const { revalidatePath } = require('next/cache');
        revalidatePath('/admin/posts');

        return { success: true };
    } catch (error) {
        console.error('Error deleting article:', error);
        return { success: false };
    }
}

export async function getArticleBySlug(slug: string) {
    try {
        const db = await getDb();
        const article = await db.collection('articles').findOne({ slug });
        return article ? JSON.parse(JSON.stringify(article)) : null;
    } catch (error) {
        console.error('Error fetching article by slug:', error);
        return null;
    }
}

export async function getRelatedArticles(category: string, currentSlug: string) {
    try {
        const db = await getDb();
        const articles = await db.collection('articles')
            .find({
                category,
                slug: { $ne: currentSlug },
                status: 'published'
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();
        return JSON.parse(JSON.stringify(articles));
    } catch (error) {
        console.error('Error fetching related articles:', error);
        return [];
    }
}

export async function getArticleById(id: string) {
    try {
        const { ObjectId } = require('mongodb');
        const db = await getDb();
        const article = await db.collection('articles').findOne({ _id: new ObjectId(id) });
        return article ? JSON.parse(JSON.stringify(article)) : null;
    } catch (error) {
        console.error('Error fetching article by ID:', error);
        return null;
    }
}

export async function getAdminStats() {
    try {
        const db = await getDb();
        const collection = db.collection('articles');

        const total = await collection.countDocuments();
        const published = await collection.countDocuments({ status: 'published' });
        const draft = await collection.countDocuments({ status: 'draft' });

        // Recent logs/activity simulation - usually this would come from a logs collection
        const recentActivity = await collection
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        return {
            total,
            published,
            draft,
            recentActivity: JSON.parse(JSON.stringify(recentActivity))
        };
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return { total: 0, published: 0, draft: 0, recentActivity: [] };
    }
}

export async function getArticlesByKeyword(keyword: string, pageCount: number = 1, limit: number = 20) {
    try {
        const db = await getDb();
        const skip = (pageCount - 1) * limit;

        // Search in title, content, or category
        const query = {
            status: 'published',
            $or: [
                { translatedTitle: { $regex: keyword, $options: 'i' } },
                { translatedContent: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } }
            ]
        };

        const articles = await db
            .collection('articles')
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        return JSON.parse(JSON.stringify(articles));
    } catch (error) {
        console.error('Error fetching articles by keyword:', error);
        return [];
    }
}

export async function getArticlesCountByKeyword(keyword: string) {
    try {
        const db = await getDb();
        const query = {
            status: 'published',
            $or: [
                { translatedTitle: { $regex: keyword, $options: 'i' } },
                { translatedContent: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } }
            ]
        };

        return await db.collection('articles').countDocuments(query);
    } catch (error) {
        console.error('Error fetching articles count by keyword:', error);
        return 0;
    }
}
