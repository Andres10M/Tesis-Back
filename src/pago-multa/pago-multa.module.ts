import { Module } from '@nestjs/common';
import { PagoMultaService } from './pago-multa.service';
import { PagoMultaController } from './pago-multa.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PagoMultaController],
  providers: [PagoMultaService, PrismaService],
})
export class PagoMultaModule {}
