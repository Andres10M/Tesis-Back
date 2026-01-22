import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CuotasModule } from '../cuotas/cuotas.module'; // 👈 SE AGREGA

@Module({
  imports: [
    PrismaModule,
    CuotasModule,   // 👈 SE AGREGA
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
