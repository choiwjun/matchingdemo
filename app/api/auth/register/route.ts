import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            email,
            password,
            firstName,
            lastName,
            phone,
            role,
            region,
            interests,
            companyName,
            businessNumber,
        } = body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: '이미 등록된 이메일입니다.' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                phone,
                role: role || 'USER',
                profile: {
                    create: {
                        firstName,
                        lastName,
                        region,
                        interests: interests || [],
                    },
                },
                ...(role === 'BUSINESS' && {
                    businessProfile: {
                        create: {
                            companyName: companyName || '',
                            businessNumber,
                            categories: interests || [],
                            serviceAreas: region ? [region] : [],
                            portfolioImages: [],
                        },
                    },
                }),
            },
            include: {
                profile: true,
                businessProfile: true,
            },
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: '회원가입 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
