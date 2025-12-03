import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, role, firstName, lastName, phone } = body;

        // Validation
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: '필수 정보를 모두 입력해주세요.' },
                { status: 400 }
            );
        }

        // Check if user already exists
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
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with profile
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
                    },
                },
            },
            include: {
                profile: true,
            },
        });

        // Create business profile if role is BUSINESS
        if (role === 'BUSINESS') {
            await prisma.businessProfile.create({
                data: {
                    userId: user.id,
                    companyName: `${firstName} ${lastName}`,
                },
            });
        }

        return NextResponse.json(
            {
                message: '회원가입이 완료되었습니다.',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: '회원가입 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
