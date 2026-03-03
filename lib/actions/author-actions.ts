'use server';

import { getDb } from '../mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export interface Author {
    _id?: string;
    name: string;
    role: string;
    bio: string;
    avatar: string;
    experience: number;
    specialties: string[];
    social: { facebook: string; twitter: string };
    isActive: boolean;
    articleCount?: number;
    createdAt?: string;
}

// ─── READ ────────────────────────────────────────────────────────────────────

export async function getAuthors(onlyActive = false): Promise<Author[]> {
    try {
        const db = await getDb();
        const query = onlyActive ? { isActive: true } : {};
        const authors = await db.collection('authors')
            .find(query)
            .sort({ createdAt: 1 })
            .toArray();
        return JSON.parse(JSON.stringify(authors));
    } catch (e) {
        console.error('getAuthors error:', e);
        return [];
    }
}

export async function getAuthorById(id: string): Promise<Author | null> {
    try {
        const db = await getDb();
        const author = await db.collection('authors').findOne({ _id: new ObjectId(id) });
        return author ? JSON.parse(JSON.stringify(author)) : null;
    } catch (e) {
        return null;
    }
}

// ─── ROUND-ROBIN ASSIGNMENT ──────────────────────────────────────────────────

/**
 * Returns the next active author in round-robin order.
 * Picks the one who hasn't written an article in the longest time
 * (i.e. the one with the oldest `lastAssignedAt` or no date at all).
 */
export async function getNextAuthorForArticle(): Promise<Author | null> {
    try {
        const db = await getDb();
        // Pick the active author with the oldest lastAssignedAt (or null = never assigned)
        const author = await db.collection('authors')
            .find({ isActive: true })
            .sort({ lastAssignedAt: 1 })   // null sorts first in MongoDB
            .limit(1)
            .next();

        if (!author) return null;

        // Update lastAssignedAt so next call picks a different author
        await db.collection('authors').updateOne(
            { _id: author._id },
            { $set: { lastAssignedAt: new Date().toISOString() } }
        );

        return JSON.parse(JSON.stringify(author));
    } catch (e) {
        console.error('getNextAuthorForArticle error:', e);
        return null;
    }
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

export async function createAuthor(data: Omit<Author, '_id' | 'createdAt'>) {
    try {
        const db = await getDb();
        const result = await db.collection('authors').insertOne({
            ...data,
            specialties: data.specialties || [],
            social: data.social || { facebook: '', twitter: '' },
            isActive: data.isActive ?? true,
            articleCount: 0,
            createdAt: new Date().toISOString(),
            lastAssignedAt: null,
        });
        revalidatePath('/admin/authors');
        revalidatePath('/tac-gia');
        return { success: true, id: result.insertedId.toString() };
    } catch (e) {
        console.error('createAuthor error:', e);
        return { success: false, error: 'Không thể tạo tác giả' };
    }
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export async function updateAuthor(id: string, data: Partial<Author>) {
    try {
        const db = await getDb();
        const { _id, ...updateData } = data as any;
        await db.collection('authors').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        revalidatePath('/admin/authors');
        revalidatePath('/tac-gia');
        return { success: true };
    } catch (e) {
        console.error('updateAuthor error:', e);
        return { success: false, error: 'Không thể cập nhật tác giả' };
    }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

export async function deleteAuthor(id: string) {
    try {
        const db = await getDb();

        // Count active authors — don't allow deleting if only 1 remains
        const activeCount = await db.collection('authors').countDocuments({ isActive: true });
        const targetAuthor = await db.collection('authors').findOne({ _id: new ObjectId(id) });
        if (targetAuthor?.isActive && activeCount <= 1) {
            return { success: false, error: 'Phải có ít nhất 1 tác giả đang hoạt động' };
        }

        await db.collection('authors').deleteOne({ _id: new ObjectId(id) });
        revalidatePath('/admin/authors');
        revalidatePath('/tac-gia');
        return { success: true };
    } catch (e) {
        console.error('deleteAuthor error:', e);
        return { success: false, error: 'Không thể xóa tác giả' };
    }
}

// ─── TOGGLE ACTIVE ──────────────────────────────────────────────────────────

export async function toggleAuthorActive(id: string, isActive: boolean) {
    try {
        const db = await getDb();
        if (!isActive) {
            // Deactivating — check if it's the last active one
            const activeCount = await db.collection('authors').countDocuments({ isActive: true });
            if (activeCount <= 1) {
                return { success: false, error: 'Phải có ít nhất 1 tác giả đang hoạt động' };
            }
        }
        await db.collection('authors').updateOne(
            { _id: new ObjectId(id) },
            { $set: { isActive } }
        );
        revalidatePath('/admin/authors');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Lỗi cập nhật trạng thái' };
    }
}

// ─── SEED DEFAULT AUTHORS ────────────────────────────────────────────────────

export async function seedDefaultAuthors() {
    try {
        const db = await getDb();
        const count = await db.collection('authors').countDocuments();
        if (count >= 10) return { success: true, message: 'Already have 10+ authors' };

        const defaultAuthors = [
            {
                name: 'Nguyễn Minh Khoa', role: 'Tổng biên tập',
                bio: 'Hơn 8 năm theo dõi bóng đá châu Âu. Chuyên phân tích chiến thuật và thị trường chuyển nhượng.',
                avatar: '/author-avatar.png', experience: 8,
                specialties: ['Ngoại hạng Anh', 'Champions League', 'Chuyển nhượng'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
            {
                name: 'Trần Đức Anh', role: 'Biên tập viên La Liga & Serie A',
                bio: '5 năm kinh nghiệm bình luận bóng đá Tây Ban Nha và Italy.',
                avatar: '/author-avatar.png', experience: 5,
                specialties: ['La Liga', 'Serie A', 'Ligue 1'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
            {
                name: 'Lê Phương Linh', role: 'Biên tập viên Tin tức & Video',
                bio: '3 năm hoạt động trong truyền thông thể thao kỹ thuật số.',
                avatar: '/author-avatar.png', experience: 3,
                specialties: ['Tin nhanh', 'Video highlights', 'Lịch thi đấu'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
            {
                name: 'Phạm Hoàng Nam', role: 'Chuyên gia Ngoại hạng Anh',
                bio: '12 năm kinh nghiệm phân tích chiều sâu về giải Ngoại hạng Anh và nhóm Big Six.',
                avatar: '/author-avatar.png', experience: 12,
                specialties: ['Ngoại hạng Anh', 'Chiến thuật', 'Phân tích chiều sâu'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
            {
                name: 'Vũ Thùy Chi', role: 'Biên tập viên Bundesliga',
                bio: 'Chuyên gia về bóng đá Đức và các giải vô địch quốc gia nữ châu Âu.',
                avatar: '/author-avatar.png', experience: 6,
                specialties: ['Bundesliga', 'Bóng đá nữ', 'Đội tuyển Đức'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
            {
                name: 'Đặng Quốc Bảo', role: 'Chuyên gia Soi kèo & Dữ liệu',
                bio: 'Phân tích trận đấu dựa trên dữ liệu Opta và các chỉ số thống kê chuyên sâu.',
                avatar: '/author-avatar.png', experience: 7,
                specialties: ['Soi kèo bóng đá', 'Dữ liệu Opta', 'Thống kê'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
            {
                name: 'Hoàng Thanh Tùng', role: 'Ký giả bóng đá quốc tế',
                bio: 'Ký giả kỳ cựu với 15 năm kinh nghiệm tác nghiệp tại các kỳ World Cup và Euro.',
                avatar: '/author-avatar.png', experience: 15,
                specialties: ['Champions League', 'World Cup', 'Euro'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
            {
                name: 'Bùi Gia Huy', role: 'Săn tin Chuyển nhượng',
                bio: 'Chuyên cập nhật các tin đồn chuyển nhượng nóng hổi và theo dõi tài năng trẻ thế giới.',
                avatar: '/author-avatar.png', experience: 4,
                specialties: ['Tin chuyển nhượng', 'Tài năng trẻ', 'Wonderkids'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
            {
                name: 'Nguyễn Hà My', role: 'Phóng viên Hậu trường',
                bio: 'Phụ trách chuyên mục đời sống cầu thủ và những câu chuyện thú vị sau sân cỏ.',
                avatar: '/author-avatar.png', experience: 5,
                specialties: ['Đời sống cầu thủ', 'Hậu trường', 'Phỏng vấn'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
            {
                name: 'Đỗ Mạnh Trường', role: 'Chuyên gia bóng đá Châu Á',
                bio: '10 năm kinh nghiệm theo dõi các giải đấu hàng đầu khu vực như J-League, K-League và AFC.',
                avatar: '/author-avatar.png', experience: 10,
                specialties: ['AFC Champions League', 'Bóng đá Châu Á', 'J-League'],
                social: { facebook: 'https://facebook.com/tinthethao24h', twitter: 'https://twitter.com/tinthethao24h' },
                isActive: true, articleCount: 0, createdAt: new Date().toISOString(), lastAssignedAt: null,
            },
        ];

        // Only insert authors that don't exist yet by name to avoid duplicates
        for (const author of defaultAuthors) {
            const exists = await db.collection('authors').findOne({ name: author.name });
            if (!exists) {
                await db.collection('authors').insertOne(author);
            }
        }

        revalidatePath('/admin/authors');
        revalidatePath('/tac-gia');
        return { success: true, message: 'Seeded authors to total 10' };
    } catch (e) {
        return { success: false };
    }
}
