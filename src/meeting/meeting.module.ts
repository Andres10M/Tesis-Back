import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CuotasModule } from '../cuotas/cuotas.module';
import { CreditosEspecialesModule } from '../creditos-especiales/creditos-especiales.module'; // 👈 NUEVO

@Module({
  imports: [
    PrismaModule,
    CuotasModule,
    CreditosEspecialesModule, // 🔥 ESTA LÍNEA ES LA OTRA CLAVE
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
