import { Injectable, Logger } from '@nestjs/common';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    Logger.log('Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    Logger.log('Database disconnected successfully');
  }

  async clearDataBase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clear database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_'),
    );

    return Promise.all(
      models.map((key) => {
        if (typeof key === 'string') {
          return this[key].deleteMany();
        }
      }),
    );
  }
}
