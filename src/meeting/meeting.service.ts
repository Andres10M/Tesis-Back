import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoAsistencia } from '@prisma/client';
import { CuotasService } from '../cuotas/cuotas.service'; // 👈 NUEVO

@Injectable()
export class MeetingService {
  constructor(
    private prisma: PrismaService,
    private cuotasService: CuotasService, // 👈 NUEVO
  ) {}

  // Crear reunión y generar asistencias para todos los socios activos
  async create(fecha: string) {
    // Parsear fecha sin desfase usando mediodía local
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);

    const meeting = await this.prisma.meeting.create({
      data: {
        fecha: date,
        descripcion: '',
      },
    });

    // 👇 NUEVO: crear cuotas automáticas
    await this.cuotasService.crearCuotasPorReunion(meeting.id);

    // Obtener socios activos ordenados por orderIndex
    const socios = await this.prisma.person.findMany({
      where: { status: true, isDelete: false },
      orderBy: { orderIndex: 'asc' },
    });

    // Crear asistencias iniciales con estado ASISTIO y multa 0
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

    console.log('📅 REUNIÓN CREADA Y ASISTENCIAS GENERADAS:', meeting.fecha);

    return meeting;
  }

  async findAll() {
    return this.prisma.meeting.findMany({
      orderBy: { fecha: 'desc' },
    });
  }

  async findOne(id: number) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      select: { id: true, fecha: true, descripcion: true },
    });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');
    return meeting;
  }

  async updateOrdenDia(id: number, orden: string) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');

    const updated = await this.prisma.meeting.update({
      where: { id },
      data: { descripcion: orden },
    });

    console.log('✅ ORDEN DEL DÍA GUARDADO EN BD');

    return updated;
  }

  async remove(id: number) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');

    await this.prisma.attendance.deleteMany({
      where: { meetingId: id },
    });

    // 👇 NO TOCAMOS NADA AQUÍ
    // Prisma se encarga de borrar cuotas por Cascade

    await this.prisma.meeting.delete({ where: { id } });

    console.log('🗑️ REUNIÓN ELIMINADA:', meeting.fecha);

    return { message: 'Reunión eliminada correctamente' };
  }
}
