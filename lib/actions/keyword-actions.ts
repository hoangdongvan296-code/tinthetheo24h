'use server';

import { getDb } from '../mongodb';
import { revalidatePath } from 'next/cache';

export async function getKeywords() {
    try {
        const db = await getDb();
        const keywords = await db
            .collection('keywords')
            .find({})
            .sort({ keyword: 1 })
            .toArray();
        return JSON.parse(JSON.stringify(keywords));
    } catch (error) {
        console.error('Error fetching keywords:', error);
        return [];
    }
}

export async function addKeyword(keyword: string, url: string) {
    try {
        const db = await getDb();
        await db.collection('keywords').insertOne({
            keyword,
            url,
            createdAt: new Date(),
        });
        revalidatePath('/admin/keywords');
        return { success: true };
    } catch (error) {
        console.error('Error adding keyword:', error);
        return { success: false, error: 'Failed to add keyword' };
    }
}

export async function deleteKeyword(id: string) {
    try {
        const { ObjectId } = require('mongodb');
        const db = await getDb();
        await db.collection('keywords').deleteOne({ _id: new ObjectId(id) });
        revalidatePath('/admin/keywords');
        return { success: true };
    } catch (error) {
        console.error('Error deleting keyword:', error);
        return { success: false };
    }
}
