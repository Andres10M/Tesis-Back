import { Module } from '@nestjs/common';
import { AporteService } from './aporte.service';
import { AporteController } from './aporte.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AporteController],
  providers: [AporteService, PrismaService],
})
export class AporteModule {}
