import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
                    throw new Error('メールアドレスとパスワードを入力してください。');
                }

                // Demo User Logic
                if (credentials.email === 'demo@example.com' && credentials.password === 'demo') {
                    try {
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
                    } catch (error) {
                        console.error('Demo login error:', error);
                        throw new Error('デモログインに失敗しました。データベース接続を確認してください。');
                    }
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        include: {
                            profile: true,
                            businessProfile: true,
                        },
                    });

                    if (!user || !user.password) {
                        throw new Error('メールアドレスまたはパスワードが正しくありません。');
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error('メールアドレスまたはパスワードが正しくありません。');
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        throw error;
                    }
                    throw new Error('ログイン処理中にエラーが発生しました。');
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
            // 같은 사이트 내 URL이면 그대로 사용
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            }
            // 같은 origin이면 그대로 사용
            if (url.startsWith(baseUrl)) {
                return url;
            }
            // 기본적으로 dashboard로 리다이렉트
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
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};
