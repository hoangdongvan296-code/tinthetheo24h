import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(req: Request) {
    try {
        const { currentPassword, newUsername, newPassword } = await req.json();

        // Validate current password
        const envValidPass = process.env.ADMIN_PASSWORD || 'bongda2026';
        const envValidUser = process.env.ADMIN_USERNAME || 'admin';

        if (currentPassword !== envValidPass) {
            return NextResponse.json({ success: false, error: 'Mật khẩu hiện tại không đúng' }, { status: 403 });
        }

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 });
        }

        // Read and update .env.local
        const envPath = path.join(process.cwd(), '.env.local');
        let envContent = '';
        try {
            envContent = fs.readFileSync(envPath, 'utf-8');
        } catch {
            // .env.local doesn't exist, create from scratch
        }

        const finalUsername = newUsername?.trim() || envValidUser;
        const finalPassword = newPassword.trim();

        // Update or add ADMIN_USERNAME
        if (envContent.match(/^ADMIN_USERNAME=.*/m)) {
            envContent = envContent.replace(/^ADMIN_USERNAME=.*/m, `ADMIN_USERNAME=${finalUsername}`);
        } else {
            envContent += `\nADMIN_USERNAME=${finalUsername}`;
        }

        // Update or add ADMIN_PASSWORD
        if (envContent.match(/^ADMIN_PASSWORD=.*/m)) {
            envContent = envContent.replace(/^ADMIN_PASSWORD=.*/m, `ADMIN_PASSWORD=${finalPassword}`);
        } else {
            envContent += `\nADMIN_PASSWORD=${finalPassword}`;
        }

        fs.writeFileSync(envPath, envContent, 'utf-8');

        return NextResponse.json({
            success: true,
            message: 'Đã cập nhật mật khẩu trong .env.local. Vui lòng restart server để có hiệu lực.'
        });
    } catch (error: any) {
        console.error('Change password error:', error);
        return NextResponse.json({ success: false, error: 'Lỗi server: ' + error.message }, { status: 500 });
    }
}
