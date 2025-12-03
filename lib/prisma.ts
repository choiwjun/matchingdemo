import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    // Skip database connection during build time if DATABASE_URL is not properly set
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
        console.warn('DATABASE_URL is not set. Using dummy configuration for build time.');
    }
    
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
