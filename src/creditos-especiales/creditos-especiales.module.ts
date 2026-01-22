import { Module } from '@nestjs/common';
import { CreditosEspecialesController } from './creditos-especiales.controller';
import { CreditosEspecialesService } from './creditos-especiales.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CreditosEspecialesController],
  providers: [CreditosEspecialesService, PrismaService],
})
export class CreditosEspecialesModule {}
