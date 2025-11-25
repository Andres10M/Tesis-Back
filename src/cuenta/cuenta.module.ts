import { Module } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { CuentaController } from './cuenta.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CuentaController],
  providers: [CuentaService, PrismaService],
})
export class CuentaModule {}
