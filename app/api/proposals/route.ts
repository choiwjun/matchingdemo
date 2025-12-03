import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProjectStatus, NotificationType } from '@/lib/types';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: '로그인이 필요합니다.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        const where = {
            ...(projectId ? { projectId } : { businessId: session.user.id }),
        };

        const proposals = await prisma.proposal.findMany({
            where,
            include: {
                project: true,
                business: {
                    include: {
                        businessProfile: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(proposals);
    } catch (error) {
        console.error('❌ Error fetching proposals:', error);
        console.error('Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : 'No stack trace',
        });
        return NextResponse.json(
            {
                error: '제안 조회 중 오류가 발생했습니다.',
                details: process.env.NODE_ENV === 'development' && error instanceof Error
                    ? error.message
                    : undefined
            },
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

        if (session.user.role !== 'BUSINESS') {
            return NextResponse.json(
                { error: '사업자만 제안할 수 있습니다.' },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const projectId = formData.get('projectId') as string;
        const amount = parseInt(formData.get('amount') as string);
        const description = formData.get('description') as string;
        const timeline = formData.get('timeline') as string;

        // Check if project exists and is open
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return NextResponse.json(
                { error: '프로젝트를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        if (project.status !== ProjectStatus.OPEN) {
            return NextResponse.json(
                { error: '이 프로젝트는 더 이상 제안을 받지 않습니다.' },
                { status: 400 }
            );
        }

        // Check if already submitted
        const existingProposal = await prisma.proposal.findFirst({
            where: {
                projectId,
                businessId: session.user.id,
            },
        });

        if (existingProposal) {
            return NextResponse.json(
                { error: '이미 이 프로젝트에 제안을 제출했습니다.' },
                { status: 400 }
            );
        }

        const proposal = await prisma.proposal.create({
            data: {
                projectId,
                businessId: session.user.id,
                amount,
                description,
                timeline,
                attachments: JSON.stringify([]),
            },
        });

        // Create notification for project owner
        await prisma.notification.create({
            data: {
                userId: project.userId,
                type: NotificationType.NEW_PROPOSAL,
                title: '새로운 제안이 도착했습니다',
                message: `"${project.title}" 프로젝트에 새로운 제안이 도착했습니다.`,
                link: `/dashboard/projects/${projectId}`,
            },
        });

        return NextResponse.json(proposal, { status: 201 });
    } catch (error) {
        console.error('Error creating proposal:', error);
        return NextResponse.json(
            { error: '제안 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
