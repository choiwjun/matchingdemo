import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// NEXTAUTH_SECRET이 없으면 경고 (프로덕션에서는 필수)
if (!process.env.NEXTAUTH_SECRET) {
    console.warn('⚠️ NEXTAUTH_SECRET is not set. Please set it in environment variables.');
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Demo User Logic
                    if (credentials.email === 'demo@example.com' && credentials.password === 'demo') {
                        let user = await prisma.user.findUnique({
                            where: { email: 'demo@example.com' },
                        });

                        if (!user) {
                            const hashedPassword = await bcrypt.hash('demo', 12);
                            user = await prisma.user.create({
                                data: {
                                    email: 'demo@example.com',
                                    password: hashedPassword,
                                    role: 'USER',
                                    profile: {
                                        create: {
                                            firstName: 'Demo',
                                            lastName: 'User',
                                            region: 'tokyo',
                                            interests: '[]',
                                        },
                                    },
                                },
                            });
                        }

                        return {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                        };
                    }

                    // Regular user login
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
        // Google OAuth (환경변수가 있을 때만 활성화)
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }),
            ]
            : []),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            }
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return `${baseUrl}/dashboard`;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    // secret이 없으면 기본값 사용 (개발용, 프로덕션에서는 반드시 설정 필요)
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
    debug: process.env.NODE_ENV === 'development',
};
