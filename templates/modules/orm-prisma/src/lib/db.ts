import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Prisma 7 uses node-pg. With current pg-connection-string, sslmode=require|prefer|verify-ca
 * are aliases for verify-full unless uselibpqcompat=true is set — which is what managed
 * Postgres providers need when their cert chain is not in Node's trust store.
 */
function createAdapter() {
  const connectionString
    = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/app';
  const isLocalhost = /(?:localhost|127\.0\.0\.1)/i.test(connectionString);

  if (isLocalhost) {
    return new PrismaPg({ connectionString });
  }

  let url = connectionString;
  const extras: string[] = [];
  if (!/[?&]sslmode=/i.test(url)) {
    extras.push('sslmode=require');
  }
  if (!/[?&]uselibpqcompat=/i.test(url)) {
    extras.push('uselibpqcompat=true');
  }
  if (extras.length > 0) {
    url += (url.includes('?') ? '&' : '?') + extras.join('&');
  }

  return new PrismaPg({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: createAdapter() });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
