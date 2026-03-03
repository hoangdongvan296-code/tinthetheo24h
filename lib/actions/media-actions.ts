"use server";

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'];

export async function getMediaFiles() {
    try {
        if (!fs.existsSync(PUBLIC_DIR)) {
            return [];
        }

        const files = fs.readdirSync(PUBLIC_DIR);
        const mediaFiles = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ALLOWED_EXTENSIONS.includes(ext);
            })
            .map(file => {
                const stats = fs.statSync(path.join(PUBLIC_DIR, file));
                return {
                    name: file,
                    url: `/${file}`,
                    size: stats.size,
                    createdAt: stats.birthtime.toISOString(),
                };
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return mediaFiles;
    } catch (error) {
        console.error('Error fetching media files:', error);
        return [];
    }
}

export async function deleteMediaFile(filename: string) {
    try {
        const filePath = path.join(PUBLIC_DIR, filename);

        // Security check: ensure the file is actually in the public directory
        if (!filePath.startsWith(PUBLIC_DIR)) {
            throw new Error('Unauthorized deletion path');
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            revalidatePath('/admin/media');
            return { success: true };
        }
        return { success: false, error: 'File not found' };
    } catch (error) {
        console.error('Error deleting media file:', error);
        return { success: false, error: 'Failed to delete file' };
    }
}

export async function uploadMediaFile(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        const ext = path.extname(file.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return { success: false, error: 'File type not allowed' };
        }

        // 10MB limit
        if (file.size > 10 * 1024 * 1024) {
            return { success: false, error: 'File too large (max 10MB)' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save with a timestamp to avoid name collisions
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const filename = `${timestamp}_${safeName}`;
        const filePath = path.join(PUBLIC_DIR, filename);

        fs.writeFileSync(filePath, buffer);

        revalidatePath('/admin/media');
        return { success: true, filename };
    } catch (error) {
        console.error('Error uploading media file:', error);
        return { success: false, error: 'Failed to upload file' };
    }
}

