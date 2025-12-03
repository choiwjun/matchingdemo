import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

// NEXTAUTH_SECRET이 없으면 경고
if (!process.env.NEXTAUTH_SECRET) {
    console.warn('⚠️ NEXTAUTH_SECRET is not set.');
}

// DATABASE_URL이 없으면 경고
if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL is not set. Only demo login will work.');
}

// Prisma는 DATABASE_URL이 있을 때만 import
let prisma: any = null;
async function getPrisma() {
    if (!prisma && process.env.DATABASE_URL) {
        const { prisma: prismaClient } = await import('@/lib/prisma');
        prisma = prismaClient;
    }
    return prisma;
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
                    console.log('Missing credentials');
                    return null;
                }

                console.log('Login attempt for:', credentials.email);

                // Demo User - DB 없이도 동작
                if (credentials.email === 'demo@example.com' && credentials.password === 'demo') {
                    console.log('Demo login successful');
                    
                    // DB가 있으면 사용자 생성/조회 시도
                    if (process.env.DATABASE_URL) {
                        try {
                            const db = await getPrisma();
                            if (db) {
                                let user = await db.user.findUnique({
                                    where: { email: 'demo@example.com' },
                                });

                                if (!user) {
                                    const hashedPassword = await bcrypt.hash('demo', 12);
                                    user = await db.user.create({
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
                        } catch (error) {
                            console.error('DB error for demo user:', error);
                        }
                    }
                    
                    // DB 없으면 하드코딩된 데모 사용자 반환
                    return {
                        id: 'demo-user-id',
                        email: 'demo@example.com',
                        role: 'USER',
                    };
                }

                // 일반 사용자 로그인 - DB 필요
                if (!process.env.DATABASE_URL) {
                    console.log('No DATABASE_URL, only demo login available');
                    return null;
                }

                try {
                    const db = await getPrisma();
                    if (!db) {
                        console.log('Prisma client not available');
                        return null;
                    }

                    const user = await db.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !user.password) {
                        console.log('User not found:', credentials.email);
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        console.log('Invalid password for:', credentials.email);
                        return null;
                    }

                    console.log('Login successful for:', credentials.email);
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
        // Google OAuth
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
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
    debug: true, // 디버그 활성화
};
