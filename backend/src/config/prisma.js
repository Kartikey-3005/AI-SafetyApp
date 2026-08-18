import { PrismaClient } from '@prisma/client';

let prisma;

try {
  prisma = new PrismaClient({
    log: [], // Suppress noisy unhandled connection attempts
  });
} catch (e) {
  prisma = null;
}

export default prisma;
