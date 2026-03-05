import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'admin_session';

export function middleware(req: NextRequest) {
    const validUser = process.env.ADMIN_USERNAME || 'admin';
    const validPass = process.env.ADMIN_PASSWORD || 'bongda2026';

    // 1️⃣ Kiểm tra cookie session (dùng cho browser/admin UI)
    const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE);
    if (sessionCookie?.value === Buffer.from(`${validUser}:${validPass}`).toString('base64')) {
        return NextResponse.next();
    }

    // 2️⃣ Kiểm tra Basic Auth (dùng cho cron.js và direct API calls)
    const basicAuth = req.headers.get('authorization');
    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        // password có thể chứa ':', nên join lại phần sau user
        const decoded = atob(authValue);
        const colonIdx = decoded.indexOf(':');
        const user = decoded.substring(0, colonIdx);
        const pwd = decoded.substring(colonIdx + 1);

        if (user === validUser && pwd === validPass) {
            // Set cookie session để browser dùng cho các requests tiếp theo
            const res = NextResponse.next();
            res.cookies.set(ADMIN_SESSION_COOKIE, Buffer.from(`${validUser}:${validPass}`).toString('base64'), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 8, // 8 giờ
                path: '/',
            });
            return res;
        }
    }

    // 3️⃣ Không xác thực được → yêu cầu Basic Auth
    return new NextResponse('Auth required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};

