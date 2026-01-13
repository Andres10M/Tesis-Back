import { Module } from '@nestjs/common';
import { CuentasService } from './cuenta.service';
import { CuentasController } from './cuenta.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CuentasController],
  providers: [CuentasService, PrismaService],
})
export class CuentaModule {}
