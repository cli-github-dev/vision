import { PrismaClient } from '@prisma/client';

// https://stackoverflow.com/questions/68322578/recent-updated-version-of-types-node-is-creating-an-error-the-previous-versi
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
