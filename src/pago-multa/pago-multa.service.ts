import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagoMultaService {
  constructor(private prisma: PrismaService) {}

  async pagar(data: {
    attendanceId: number;
    socioId: string;
    monto: number;
    registradoPor: string;
  }) {
    const asistencia = await this.prisma.attendance.findUnique({
      where: { id: data.attendanceId },
    });

    if (!asistencia || asistencia.multa.lte(0)) {
      throw new BadRequestException('Multa inexistente o ya pagada');
    }

    return this.prisma.$transaction(async tx => {
      await tx.pagoMulta.create({
        data: {
          socioId: data.socioId,
          monto: data.monto,
          registradoPor: data.registradoPor,
        },
      });

      await tx.attendance.update({
        where: { id: data.attendanceId },
        data: { multa: 0 },
      });
    });
  }

  async historial(nui?: string) {
    const rows = await this.prisma.pagoMulta.findMany({
      where: nui ? { socioId: nui } : {},
      include: { socio: true },
      orderBy: { fecha: 'desc' },
    });

    return rows.map(r => ({
      id: r.id,
      nui: r.socioId,
      socio: `${r.socio.firstname} ${r.socio.lastname}`,
      fechaPago: r.fecha,
      monto: r.monto.toNumber(),
      registradoPor: r.registradoPor,
    }));
  }
}
