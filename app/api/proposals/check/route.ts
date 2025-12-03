import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

        if (!projectId) {
            return NextResponse.json(
                { error: 'projectId가 필요합니다.' },
                { status: 400 }
            );
        }

        const existingProposal = await prisma.proposal.findFirst({
            where: {
                projectId,
                businessId: session.user.id,
            },
        });

        return NextResponse.json({
            hasSubmitted: !!existingProposal,
            proposal: existingProposal,
        });
    } catch (error) {
        console.error('Error checking proposal:', error);
        return NextResponse.json(
            { error: '제안 확인 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
