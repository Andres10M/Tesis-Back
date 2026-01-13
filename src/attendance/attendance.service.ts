import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(private prisma: PrismaService) {}

  // ======================================
  // LISTAR / CREAR ASISTENCIAS POR REUNIÓN
  // ======================================
  async findByMeeting(meetingId: number) {
    let asistencias = await this.prisma.attendance.findMany({
      where: { meetingId },
      include: {
        person: true,
        meeting: true,
      },
      orderBy: {
        person: { orderIndex: 'asc' },
      },
    });

    // 🔥 SI NO EXISTEN, SE CREAN AUTOMÁTICAMENTE
    if (asistencias.length === 0) {
      const socios = await this.prisma.person.findMany({
        where: {
          isDelete: false,
          status: true,
        },
        orderBy: { orderIndex: 'asc' },
      });

      if (socios.length === 0) return [];

      await this.prisma.attendance.createMany({
        data: socios.map(s => ({
          socioId: s.nui,
          meetingId,
          estado: 'ASISTIO',
          multa: new Prisma.Decimal(0),
          justificado: false,
        })),
      });

      asistencias = await this.prisma.attendance.findMany({
        where: { meetingId },
        include: {
          person: true,
          meeting: true,
        },
        orderBy: {
          person: { orderIndex: 'asc' },
        },
      });
    }

    // 🔥 CONVERTIR DECIMAL → NUMBER
    return asistencias.map(a => ({
      ...a,
      multa: a.multa.toNumber(),
    }));
  }

  // ======================================
  // RESUMEN (ASISTENCIAS + MULTAS)
  // ======================================
  async getResumen(meetingId: number) {
    const asistencias = await this.prisma.attendance.findMany({
      where: { meetingId },
    });

    return {
      asistio: asistencias.filter(a => a.estado === 'ASISTIO').length,
      tarde: asistencias.filter(a => a.estado === 'TARDE').length,
      falta: asistencias.filter(a => a.estado === 'FALTA').length,
      multas: asistencias.reduce(
        (sum, a) => sum + a.multa.toNumber(),
        0,
      ),
    };
  }

  // ======================================
  // ACTUALIZAR ASISTENCIA (🔥 CLAVE)
  // ======================================
  async update(id: number, dto: UpdateAttendanceDto) {
    const asistencia = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        meeting: true,
        person: true,
      },
    });

    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }

    if (asistencia.meeting.isClosed) {
      throw new BadRequestException('La asistencia está cerrada');
    }

    const estado = dto.estado;
    const justificado = dto.justificado ?? false;

    // 🔥 CÁLCULO DE MULTA
    let multa = new Prisma.Decimal(0);

    if (!justificado) {
      if (estado === 'TARDE') multa = new Prisma.Decimal(1);
      if (estado === 'FALTA') multa = new Prisma.Decimal(3);
    }

    const updated = await this.prisma.attendance.update({
      where: { id },
      data: {
        estado,
        observacion: dto.observacion ?? null,
        justificado,
        multa,
      },
    });

    this.logger.log(
      `✅ Asistencia actualizada → ${asistencia.person.firstname} ${asistencia.person.lastname} | Estado: ${estado} | Multa: $${multa}`,
    );

    // 🔥🔥🔥 FIX DEFINITIVO: DECIMAL → NUMBER
    return {
      ...updated,
      multa: updated.multa.toNumber(),
    };
  }

  // ======================================
  // CERRAR ASISTENCIA
  // ======================================
  async closeMeeting(meetingId: number) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      throw new NotFoundException('Reunión no encontrada');
    }

    if (meeting.isClosed) {
      throw new BadRequestException('La asistencia ya está cerrada');
    }

    const closed = await this.prisma.meeting.update({
      where: { id: meetingId },
      data: { isClosed: true },
    });

    this.logger.warn(`🔒 Asistencia cerrada → Reunión ${meetingId}`);
    return closed;
  }
}
