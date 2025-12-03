import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    // Vercel 환경에서 DATABASE_URL 체크
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
        // 빌드 타임에는 에러를 던지지 않음 (prisma generate만 필요)
        if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
            console.warn('⚠️ DATABASE_URL is not set. Database operations will fail.');
        }
    }

    const client = new PrismaClient({
        log: process.env.NODE_ENV === 'development' 
            ? ['query', 'error', 'warn'] 
            : ['error'],
        datasources: databaseUrl ? {
            db: {
                url: databaseUrl,
            },
        } : undefined,
    });

    return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
