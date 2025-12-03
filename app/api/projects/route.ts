import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');

        const where: any = {};

        if (session.user.role === 'USER') {
            where.userId = session.user.id;
        }

        if (category) {
            where.category = category;
        }

        if (status) {
            where.status = status;
        }

        const projects = await prisma.project.findMany({
            where,
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                _count: {
                    select: {
                        proposals: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Get projects error:', error);
        return NextResponse.json(
            { error: '프로젝트 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            description,
            category,
            location,
            budgetMin,
            budgetMax,
            deadline,
            images,
        } = body;

        if (!title || !description || !category || !location) {
            return NextResponse.json(
                { error: '필수 정보를 모두 입력해주세요.' },
                { status: 400 }
            );
        }

        const project = await prisma.project.create({
            data: {
                userId: session.user.id,
                title,
                description,
                category,
                location,
                budgetMin: budgetMin ? parseInt(budgetMin) : null,
                budgetMax: budgetMax ? parseInt(budgetMax) : null,
                deadline: deadline ? new Date(deadline) : null,
                images: images || [],
                status: 'OPEN',
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        // Create notification for matching businesses (simplified)
        // In production, you'd want to match based on category and location

        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        console.error('Create project error:', error);
        return NextResponse.json(
            { error: '프로젝트 등록 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
