import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session) {
            return NextResponse.json(
                { error: '로그인이 필요합니다.' },
                { status: 401 }
            );
        }

        const proposal = await prisma.proposal.findUnique({
            where: { id },
            include: {
                project: true,
            },
        });

        if (!proposal) {
            return NextResponse.json(
                { error: '제안을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // Check if user owns the project
        if (proposal.project.userId !== session.user.id) {
            return NextResponse.json(
                { error: '권한이 없습니다.' },
                { status: 403 }
            );
        }

        // Update proposal status
        await prisma.proposal.update({
            where: { id },
            data: { status: 'REJECTED' },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error('Error rejecting proposal:', error);
        return NextResponse.json(
            { error: '제안 거절 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
