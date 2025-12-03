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
            data: { status: 'ACCEPTED' },
        });

        // Reject other proposals
        await prisma.proposal.updateMany({
            where: {
                projectId: proposal.projectId,
                id: { not: id },
            },
            data: { status: 'REJECTED' },
        });

        // Create contract
        const contract = await prisma.contract.create({
            data: {
                projectId: proposal.projectId,
                proposalId: id,
                userId: session.user.id,
                businessId: proposal.businessId,
                amount: proposal.amount,
                status: 'ACTIVE',
            },
        });

        // Update project status
        await prisma.project.update({
            where: { id: proposal.projectId },
            data: { status: 'IN_PROGRESS' },
        });

        // Create notifications
        await prisma.notification.create({
            data: {
                userId: proposal.businessId,
                type: 'CONTRACT_CONFIRMED',
                title: '제안이 수락되었습니다!',
                message: `"${proposal.project.title}" 프로젝트의 제안이 수락되었습니다.`,
                link: `/business/contracts/${contract.id}`,
            },
        });

        return NextResponse.json({
            success: true,
            contract,
        });
    } catch (error) {
        console.error('Error accepting proposal:', error);
        return NextResponse.json(
            { error: '제안 수락 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
