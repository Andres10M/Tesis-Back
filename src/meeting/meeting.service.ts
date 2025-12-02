// src/meeting/meeting.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMeetingDto) {
    return this.prisma.meeting.create({
      data: {
        descripcion: dto.descripcion,
        fecha: new Date(), // ← FECHA AUTOMÁTICA
      },
    });
  }

  findAll() {
    return this.prisma.meeting.findMany({
      include: { attendances: true },
    });
  }

  findOne(id: number) {
    return this.prisma.meeting.findUnique({
      where: { id },
      include: { attendances: true },
    });
  }

  update(id: number, dto: UpdateMeetingDto) {
    return this.prisma.meeting.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.meeting.delete({
      where: { id },
    });
  }
}
