import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: '파일이 없습니다.' },
                { status: 400 }
            );
        }

        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // Create upload directory if it doesn't exist
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const urls: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(7);
            const ext = file.name.split('.').pop();
            const filename = `${timestamp}-${randomString}.${ext}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            urls.push(`/uploads/${filename}`);
        }

        return NextResponse.json({ urls });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: '파일 업로드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
