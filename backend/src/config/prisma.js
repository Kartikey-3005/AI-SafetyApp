import { PrismaClient } from '@prisma/client';

let prisma = null;
let isDbAvailable = false;

try {
  prisma = new PrismaClient({
    log: [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/safekids_db?schema=public',
      },
    },
  });
} catch (e) {
  prisma = null;
}

export async function checkDatabaseConnection() {
  if (!prisma) {
    isDbAvailable = false;
    return false;
  }

  try {
    // Quick probe with 500ms timeout
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB connection probe timeout')), 500))
    ]);
    isDbAvailable = true;
    console.log('🟢 PostgreSQL database connected.');
    return true;
  } catch (err) {
    isDbAvailable = false;
    console.log('🟡 PostgreSQL offline: Running with ultra-fast in-memory fallback storage.');
    return false;
  }
}

export function isDbConnected() {
  return isDbAvailable;
}

export default prisma;
