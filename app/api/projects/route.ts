import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProjectStatus, Prisma } from '@prisma/client';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const location = searchParams.get('location');
        const status = searchParams.get('status') || 'OPEN';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where: Prisma.ProjectWhereInput = {
            ...(status && { status: status as ProjectStatus }),
            ...(category && { category }),
            ...(location && { location }),
        };

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
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
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.project.count({ where }),
        ]);

        return NextResponse.json({
            items: projects,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: '프로젝트 조회 중 오류가 발생했습니다.' },
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

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const location = formData.get('location') as string;
        const budgetMin = parseInt(formData.get('budgetMin') as string) || null;
        const budgetMax = parseInt(formData.get('budgetMax') as string) || null;
        const deadline = formData.get('deadline') as string;

        // Handle file uploads (placeholder - implement actual file upload logic)
        const images: string[] = [];
        const attachments: string[] = [];

        // For now, skip file processing in build
        // In production, integrate with cloud storage (S3, Cloudinary, etc.)

        const project = await prisma.project.create({
            data: {
                userId: session.user.id,
                title,
                description,
                category,
                location,
                budgetMin,
                budgetMax,
                deadline: deadline ? new Date(deadline) : null,
                images,
                attachments,
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: '프로젝트 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
