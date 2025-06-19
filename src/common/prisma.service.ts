import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }
  async onModuleInit() {
    await this.$connect();
    this.logger.info('PrismaService connected to the database');

    this.$on('query', (e: any) => {
      this.logger.debug(`Query: ${e.query} Params: ${e.params}`);
    });
    this.$on('info', (e: any) => {
      this.logger.info(e.message);
    });
    this.$on('warn', (e: any) => {
      this.logger.warn(e.message);
    });
    this.$on('error', (e: any) => {
      this.logger.error(e.message);
    });
  }
}
