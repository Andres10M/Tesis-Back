import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateAttendanceDto) {
    return this.prisma.attendance.create({ data });
  }

  findAll() {
    return this.prisma.attendance.findMany({
      include: {
        person: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.attendance.findUnique({
      where: { id },
      include: { person: true },
    });
  }

  update(id: number, data: UpdateAttendanceDto) {
    return this.prisma.attendance.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.attendance.delete({
      where: { id },
    });
  }
}
