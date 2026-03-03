import { google } from 'googleapis';

/**
 * Notify Google Indexing API about a new or updated URL.
 * Requires GOOGLE_INDEXING_CREDENTIALS environment variable (JSON string).
 */
export async function notifyGoogleIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
    const credentialsJson = process.env.GOOGLE_INDEXING_CREDENTIALS;

    if (!credentialsJson) {
        console.warn('GOOGLE_INDEXING_CREDENTIALS not found. Skipping Google Indexing notification.');
        return { success: false, error: 'Missing credentials' };
    }

    try {
        const credentials = JSON.parse(credentialsJson);

        const auth = new google.auth.JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        const indexing = google.indexing({
            version: 'v3',
            auth: auth
        });

        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: type
            }
        });

        console.log(`Google Indexing API success for ${url}:`, res.data);
        return { success: true, data: res.data };
    } catch (error: any) {
        console.error(`Google Indexing API error for ${url}:`, error.message);
        return { success: false, error: error.message };
    }
}
