import { Module } from '@nestjs/common';
import { CreditosEspecialesController } from './creditos-especiales.controller';
import { CreditosEspecialesService } from './creditos-especiales.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CreditosEspecialesController],
  providers: [CreditosEspecialesService, PrismaService],
  exports: [CreditosEspecialesService], // 🔥 ESTA LÍNEA ES LA CLAVE
})
export class CreditosEspecialesModule {}
