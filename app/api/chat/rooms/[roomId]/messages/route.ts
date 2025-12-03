import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper to parse JSON arrays safely
const parseJsonArray = (value: string | null | undefined): string[] => {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

interface RouteParams {
    params: Promise<{ roomId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { roomId } = await params;

        if (!session) {
            return NextResponse.json(
                { error: 'ログインが必要です。' },
                { status: 401 }
            );
        }

        // Verify user is in room
        const room = await prisma.chatRoom.findUnique({
            where: { id: roomId },
        });

        const roomUserIds = parseJsonArray(room?.userIds);
        if (!room || !roomUserIds.includes(session.user.id)) {
            return NextResponse.json(
                { error: 'チャットルームにアクセスできません。' },
                { status: 403 }
            );
        }

        const messages = await prisma.message.findMany({
            where: { roomId },
            include: {
                sender: {
                    include: {
                        profile: true,
                        businessProfile: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        // Mark messages as read
        await prisma.message.updateMany({
            where: {
                roomId,
                senderId: { not: session.user.id },
                read: false,
            },
            data: { read: true },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'メッセージの取得中にエラーが発生しました。' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { roomId } = await params;

        if (!session) {
            return NextResponse.json(
                { error: 'ログインが必要です。' },
                { status: 401 }
            );
        }

        // Verify user is in room
        const room = await prisma.chatRoom.findUnique({
            where: { id: roomId },
        });

        const roomUserIds = parseJsonArray(room?.userIds);
        if (!room || !roomUserIds.includes(session.user.id)) {
            return NextResponse.json(
                { error: 'チャットルームにアクセスできません。' },
                { status: 403 }
            );
        }

        const contentType = request.headers.get('content-type') || '';

        let content = '';
        let fileUrl: string | undefined;
        let fileName: string | undefined;
        let fileSize: number | undefined;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File | null;

            if (file) {
                // Handle file upload (placeholder - implement actual upload)
                fileName = file.name;
                fileSize = file.size;
                // fileUrl = await uploadFile(file);
                content = `[ファイル] ${fileName}`;
            }
        } else {
            const body = await request.json();
            content = body.content;
        }

        if (!content && !fileUrl) {
            return NextResponse.json(
                { error: 'メッセージ内容が必要です。' },
                { status: 400 }
            );
        }

        const message = await prisma.message.create({
            data: {
                roomId,
                senderId: session.user.id,
                content,
                fileUrl,
                fileName,
                fileSize,
            },
            include: {
                sender: {
                    include: {
                        profile: true,
                        businessProfile: true,
                    },
                },
            },
        });

        // Update room's last message time
        await prisma.chatRoom.update({
            where: { id: roomId },
            data: { lastMessageAt: new Date() },
        });

        // Create notification for other users
        const otherUserIds = roomUserIds.filter((id) => id !== session.user.id);
        if (otherUserIds.length > 0) {
            await prisma.notification.createMany({
                data: otherUserIds.map((userId) => ({
                    userId,
                    type: 'NEW_MESSAGE',
                    title: '新しいメッセージ',
                    message: content.length > 50 ? content.slice(0, 50) + '...' : content,
                    link: `/chat?roomId=${roomId}`,
                })),
            });
        }

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'メッセージの送信中にエラーが発生しました。' },
            { status: 500 }
        );
    }
}
