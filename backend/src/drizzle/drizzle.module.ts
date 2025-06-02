import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import * as schema from './schema/schema';

export const DRIZZLE = Symbol('drizzle-connection');

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseURL = configService.get<string>('DATABASE_URL');

        const pool = new Pool({
          connectionString: databaseURL,
          ssl: false,
        });

        return drizzle(pool, { schema }) as DrizzleDB;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
