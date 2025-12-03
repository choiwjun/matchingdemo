import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: '로그인이 필요합니다.' },
                { status: 401 }
            );
        }

        const rooms = await prisma.chatRoom.findMany({
            where: {
                userIds: {
                    has: session.user.id,
                },
            },
            orderBy: {
                lastMessageAt: 'desc',
            },
        });

        // Get participants and last messages for each room
        const roomsWithDetails = await Promise.all(
            rooms.map(async (room) => {
                const participants = await prisma.user.findMany({
                    where: {
                        id: {
                            in: room.userIds,
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
            { error: '채팅방 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: '로그인이 필요합니다.' },
                { status: 401 }
            );
        }

        const { participantId } = await request.json();

        if (!participantId) {
            return NextResponse.json(
                { error: '참가자 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        // Check if room already exists
        const existingRoom = await prisma.chatRoom.findFirst({
            where: {
                AND: [
                    { userIds: { has: session.user.id } },
                    { userIds: { has: participantId } },
                ],
            },
        });

        if (existingRoom) {
            const participants = await prisma.user.findMany({
                where: {
                    id: { in: existingRoom.userIds },
                },
                include: {
                    profile: true,
                    businessProfile: true,
                },
            });

            return NextResponse.json({
                ...existingRoom,
                participants,
            });
        }

        // Create new room
        const newRoom = await prisma.chatRoom.create({
            data: {
                userIds: [session.user.id, participantId],
            },
        });

        const participants = await prisma.user.findMany({
            where: {
                id: { in: newRoom.userIds },
            },
            include: {
                profile: true,
                businessProfile: true,
            },
        });

        return NextResponse.json({
            ...newRoom,
            participants,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating chat room:', error);
        return NextResponse.json(
            { error: '채팅방 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
