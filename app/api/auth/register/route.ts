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
                { error: 'このメールアドレスは既に登録されております。' },
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
                        interests: JSON.stringify(interests || []),
                    },
                },
                ...(role === 'BUSINESS' && {
                    businessProfile: {
                        create: {
                            companyName: companyName || '',
                            businessNumber,
                            categories: JSON.stringify(interests || []),
                            serviceAreas: JSON.stringify(region ? [region] : []),
                            portfolioImages: JSON.stringify([]),
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
            { error: '会員登録処理中にエラーが発生いたしました。' },
            { status: 500 }
        );
    }
}
