import { Module } from '@nestjs/common';
import { CuotasService } from './cuotas.service';
import { CuotasController } from './cuotas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CuotasService],
  controllers: [CuotasController],
  exports: [CuotasService],
})
export class CuotasModule {}
