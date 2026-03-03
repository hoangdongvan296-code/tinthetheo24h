"use server";

import { revalidatePath } from 'next/cache';
import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';
import { SiteSettings, DEFAULT_SETTINGS } from './settings-types';

async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB);
}


export async function getSettings() {
    try {
        const db = await getDb();
        const settings = await db.collection('settings').findOne({});

        if (!settings) {
            return DEFAULT_SETTINGS;
        }

        return { ...DEFAULT_SETTINGS, ...settings, _id: settings._id.toString() };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { ...DEFAULT_SETTINGS, _id: DEFAULT_SETTINGS._id.toString() };
    }
}

export async function updateSettings(data: {
    logoText?: string;
    logoUrl?: string;
    faviconUrl?: string;
    footerAbout?: string;
    footerEmail?: string;
    googleAnalyticsId?: string;
    googleSiteVerification?: string;
    defaultOgImage?: string;
    twitterHandle?: string;
    siteUrl?: string;
    siteName?: string;
    customHeaderCode?: string;
    customBodyStartCode?: string;
    customBodyEndCode?: string;
    // AdSense
    adsensePublisherId?: string;
    adsenseEnabled?: boolean;
    adsenseSlotHeader?: string;
    adsenseSlotInArticle?: string;
    adsenseSlotSidebar?: string;
    adsenseSlotFooter?: string;
}) {
    try {
        const db = await getDb();
        const existing = await db.collection('settings').findOne({});

        if (!existing) {
            const { _id, ...defaults } = DEFAULT_SETTINGS;
            await db.collection('settings').insertOne({ ...defaults, ...data });
        } else {
            await db.collection('settings').updateOne(
                { _id: new ObjectId(existing._id.toString()) },
                { $set: data }
            );
        }

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Error updating settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
