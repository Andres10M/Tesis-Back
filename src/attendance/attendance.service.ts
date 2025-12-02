import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAttendanceDto) {
    let multa = 0;

    if (!dto.justificado) {
      if (dto.estado === 'TARDE') multa = 1;
      if (dto.estado === 'FALTA') multa = 3;
    } else {
      multa = 0;
    }

    return await this.prisma.attendance.create({
      data: {
        socioId: dto.socioId,
        estado: dto.estado,
        observacion: dto.observacion,
        justificado: dto.justificado,
        multa: multa,
        reunionId: dto.reunionId
      }
    });
  }

  async findAll() {
    return this.prisma.attendance.findMany({
      include: {
        person: true,
        meeting: true
      }
    });
  }

  // 🚀 AGREGAR ESTO
  async update(id: number, dto: any) {
    return this.prisma.attendance.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.attendance.delete({
      where: { id },
    });
  }
}
