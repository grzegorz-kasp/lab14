import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

// Singleton pool connection
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

const pool = globalForPrisma.pool;
const adapter = new PrismaPg(pool);

// Singleton Prisma Client
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

const prisma = globalForPrisma.prisma;

export default prisma;
