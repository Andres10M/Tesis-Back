import { Module } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CreditController],
  providers: [CreditService, PrismaService],
})
export class CreditModule {}
