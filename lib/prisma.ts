import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
        console.error('❌ DATABASE_URL is not set!');
        console.error('Please set DATABASE_URL in your environment variables.');
        console.error('For Vercel: Settings → Environment Variables → Add DATABASE_URL');

        // In production, this is a critical error
        if (process.env.NODE_ENV === 'production') {
            throw new Error('DATABASE_URL environment variable is required in production');
        }
    }

    try {
        console.log('🔄 Initializing Prisma Client...');
        const client = new PrismaClient({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
        });
        console.log('✅ Prisma Client initialized successfully');
        return client;
    } catch (error) {
        console.error('❌ Failed to initialize Prisma Client:', error);
        throw error;
    }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
