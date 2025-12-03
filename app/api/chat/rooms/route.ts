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

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'ログインが必要です。' },
                { status: 401 }
            );
        }

        // SQLite doesn't support array contains, so we fetch all and filter
        const allRooms = await prisma.chatRoom.findMany({
            orderBy: {
                lastMessageAt: 'desc',
            },
        });

        // Filter rooms where user is a participant
        const rooms = allRooms.filter(room => {
            const userIds = parseJsonArray(room.userIds);
            return userIds.includes(session.user.id);
        });

        // Get participants and last messages for each room
        const roomsWithDetails = await Promise.all(
            rooms.map(async (room) => {
                const userIds = parseJsonArray(room.userIds);
                const participants = await prisma.user.findMany({
                    where: {
                        id: {
                            in: userIds,
                        },
                    },
                    include: {
                        profile: true,
                        businessProfile: true,
                    },
                });

                const lastMessage = await prisma.message.findFirst({
                    where: { roomId: room.id },
                    orderBy: { createdAt: 'desc' },
                });

                const unreadCount = await prisma.message.count({
                    where: {
                        roomId: room.id,
                        senderId: { not: session.user.id },
                        read: false,
                    },
                });

                return {
                    ...room,
                    userIds, // Return as array
                    participants,
                    lastMessage,
                    unreadCount,
                };
            })
        );

        return NextResponse.json(roomsWithDetails);
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        return NextResponse.json(
            { error: 'チャットルームの取得中にエラーが発生しました。' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'ログインが必要です。' },
                { status: 401 }
            );
        }

        const { participantId } = await request.json();

        if (!participantId) {
            return NextResponse.json(
                { error: '参加者IDが必要です。' },
                { status: 400 }
            );
        }

        // Check if room already exists - fetch all and filter
        const allRooms = await prisma.chatRoom.findMany();
        const existingRoom = allRooms.find(room => {
            const userIds = parseJsonArray(room.userIds);
            return userIds.includes(session.user.id) && userIds.includes(participantId);
        });

        if (existingRoom) {
            const userIds = parseJsonArray(existingRoom.userIds);
            const participants = await prisma.user.findMany({
                where: {
                    id: { in: userIds },
                },
                include: {
                    profile: true,
                    businessProfile: true,
                },
            });

            return NextResponse.json({
                ...existingRoom,
                userIds,
                participants,
            });
        }

        // Create new room with JSON stringified userIds
        const newRoom = await prisma.chatRoom.create({
            data: {
                userIds: JSON.stringify([session.user.id, participantId]),
            },
        });

        const participants = await prisma.user.findMany({
            where: {
                id: { in: [session.user.id, participantId] },
            },
            include: {
                profile: true,
                businessProfile: true,
            },
        });

        return NextResponse.json({
            ...newRoom,
            userIds: [session.user.id, participantId],
            participants,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating chat room:', error);
        return NextResponse.json(
            { error: 'チャットルームの作成中にエラーが発生しました。' },
            { status: 500 }
        );
    }
}
