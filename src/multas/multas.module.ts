import { Module } from '@nestjs/common';
import { MultasService } from './multas.service';
import { MultasController } from './multas.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MultasController],
  providers: [MultasService, PrismaService],
})
export class MultasModule {}
