import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

export type DbClient = NeonDatabase<typeof schema>;

let dbInstance: DbClient | null = null;
let poolInstance: Pool | null = null;

export function getDb(): { db: DbClient; pool: Pool } {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  if (!dbInstance || !poolInstance) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    poolInstance = pool;
    dbInstance = drizzle(pool, { schema }) as unknown as DbClient;
  }

  return { db: dbInstance, pool: poolInstance };
}

export { schema };

