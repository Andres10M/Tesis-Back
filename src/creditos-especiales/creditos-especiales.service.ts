import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditosEspecialesService {
  constructor(private prisma: PrismaService) {}

  async crearHojaVacia(meetingId: number, fecha: Date) {
    const socios = await this.prisma.person.findMany({
      where: { status: true, isDelete: false },
      orderBy: { orderIndex: 'asc' },
    });

    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;

    const filas = socios.map((s) => ({
      socioId: s.nui,
      montoPrestado: 0,
      interes: 0,
      totalPagar: 0,
      fechaCredito: fecha,
      anio,
      mes,
      meetingId,
    }));

    await this.prisma.creditoEspecial.createMany({
      data: filas,
      skipDuplicates: true,
    });

    console.log('📄 HOJA CRÉDITOS CREADA:', meetingId);
    return true;
  }

  async actualizarFila(id: number, monto: number) {
    const interes = +(monto * 0.02).toFixed(2);
    const total = +(monto + interes).toFixed(2);

    return this.prisma.creditoEspecial.update({
      where: { id },
      data: {
        montoPrestado: monto,
        interes,
        totalPagar: total,
      },
    });
  }

  async findByMeeting(meetingId: number) {
    return this.prisma.creditoEspecial.findMany({
      where: { meetingId },
      include: { socio: true },
      orderBy: { socio: { orderIndex: 'asc' } },
    });
  }

  async findAll() {
    return this.prisma.creditoEspecial.findMany({
      include: { socio: true },
      orderBy: { fechaCredito: 'desc' },
    });
  }
}
