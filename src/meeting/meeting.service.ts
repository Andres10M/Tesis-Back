import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoAsistencia } from '@prisma/client';
import { CuotasService } from '../cuotas/cuotas.service';
import { CreditosEspecialesService } from '../creditos-especiales/creditos-especiales.service';

@Injectable()
export class MeetingService {
  constructor(
    private prisma: PrismaService,
    private cuotasService: CuotasService,
    private creditosService: CreditosEspecialesService,
  ) {}

  async create(fecha: string) {
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);

    const meeting = await this.prisma.meeting.create({
      data: {
        fecha: date,
        descripcion: '',
      },
    });

    // CUOTAS AUTOMÁTICAS
    await this.cuotasService.crearCuotasPorReunion(meeting.id);

    // CRÉDITOS ESPECIALES AUTOMÁTICOS
    await this.creditosService.crearHojaVacia(meeting.id, date);

    // ASISTENCIAS
    const socios = await this.prisma.person.findMany({
      where: { status: true, isDelete: false },
      orderBy: { orderIndex: 'asc' },
    });

    const attendancesData = socios.map((socio) => ({
      socioId: socio.nui,
      meetingId: meeting.id,
      estado: EstadoAsistencia.ASISTIO,
      multa: 0,
      justificado: false,
      observacion: null,
    }));

    await this.prisma.attendance.createMany({
      data: attendancesData,
      skipDuplicates: true,
    });

    console.log('📅 REUNIÓN COMPLETA:', meeting.fecha);
    return meeting;
  }

  async findAll() {
    return this.prisma.meeting.findMany({
      orderBy: { fecha: 'desc' },
    });
  }

  // 🔒 BLINDAJE TOTAL (este era tu error)
  async findOne(id: number) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('ID inválido');
    }

    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      select: { id: true, fecha: true, descripcion: true },
    });

    if (!meeting) throw new NotFoundException('Reunión no encontrada');
    return meeting;
  }

  async updateOrdenDia(id: number, orden: string) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('ID inválido');
    }

    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');

    return this.prisma.meeting.update({
      where: { id },
      data: { descripcion: orden },
    });
  }

  async remove(id: number) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('ID inválido');
    }

    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');

    await this.prisma.attendance.deleteMany({
      where: { meetingId: id },
    });

    await this.prisma.meeting.delete({ where: { id } });

    return { message: 'Reunión eliminada correctamente' };
  }
}
