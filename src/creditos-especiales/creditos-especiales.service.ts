import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoCreditoEspecial } from '@prisma/client';

@Injectable()
export class CreditosEspecialesService {
  constructor(private prisma: PrismaService) {}

  // =========================================
  // CREAR HOJA VACÍA (SOLO VALIDACIÓN)
  // =========================================
  async crearHojaVacia(meetingId: number, fecha: Date) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      throw new Error('Reunión no encontrada');
    }

    return true;
  }

  // =========================================
  // ACTUALIZAR UNA FILA INDIVIDUAL
  // =========================================
  async actualizarFila(id: number, monto: number, pagado?: boolean) {
    const m = Number(monto) || 0;
    const interes = +(m * 0.02).toFixed(2);
    const total = +(m + interes).toFixed(2);

    const data: any = { montoPrestado: m, interes, totalPagar: total };

    if (typeof pagado === 'boolean') {
      data.pagado = pagado;
      data.estado = pagado
        ? EstadoCreditoEspecial.PAGADO
        : EstadoCreditoEspecial.PENDIENTE;
      data.fechaPago = pagado ? new Date() : null;
    }

    return this.prisma.creditoEspecial.update({
      where: { id },
      data,
    });
  }

  // =========================================
  // OBTENER FILAS POR REUNIÓN
  // =========================================
  async findByMeeting(meetingId: number) {
    return this.prisma.creditoEspecial.findMany({
      where: { meetingId },
      include: { socio: true },
      orderBy: { socio: { orderIndex: 'asc' } },
    });
  }

  // =========================================
  // TODAS LAS FILAS CON CRÉDITO
  // =========================================
  async findAll() {
    return this.prisma.creditoEspecial.findMany({
      where: { montoPrestado: { gt: 0 } },
      include: { socio: true },
      orderBy: { fechaCredito: 'desc' },
    });
  }

  // =========================================
  // ACUMULADO SOLO DE LA REUNIÓN ANTERIOR
  // =========================================
  async getAcumuladoAnterior(meetingId: number) {
    const meetingActual = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meetingActual) return { totalRecaudado: 0 };

    // Buscar reunión inmediatamente anterior
    const reunionAnterior = await this.prisma.meeting.findFirst({
      where: {
        fecha: { lt: meetingActual.fecha },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    if (!reunionAnterior) return { totalRecaudado: 0 };

    const filasPagadas = await this.prisma.creditoEspecial.findMany({
      where: {
        meetingId: reunionAnterior.id,
        pagado: true,
      },
    });

    const totalRecaudado = filasPagadas.reduce(
      (s, f) => s + Number(f.totalPagar),
      0,
    );

    return { totalRecaudado };
  }

  // =========================================
  // GUARDAR HOJA COMPLETA
  // =========================================
  async guardarHoja(
    meetingId: number,
    fecha: Date,
    filas: { socioId: string; monto: number; pagado?: boolean }[],
  ) {
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;

    await this.prisma.creditoEspecial.deleteMany({ where: { meetingId } });

    let data = filas
      .filter((f) => Number(f.monto) > 0)
      .map((f) => {
        const m = Number(f.monto);
        const interes = +(m * 0.02).toFixed(2);
        const total = +(m + interes).toFixed(2);
        const pagado = f.pagado ?? false;

        return {
          socioId: f.socioId,
          montoPrestado: m,
          interes,
          totalPagar: total,
          fechaCredito: fecha,
          anio,
          mes,
          meetingId,
          pagado,
          estado: pagado
            ? EstadoCreditoEspecial.PAGADO
            : EstadoCreditoEspecial.PENDIENTE,
          fechaPago: pagado ? new Date() : null,
        };
      });

    await this.prisma.creditoEspecial.createMany({ data });

    return true;
  }

  // =========================================
  // ELIMINAR CRÉDITOS DE UNA REUNIÓN
  // =========================================
  async eliminarPorMeeting(meetingId: number) {
    await this.prisma.creditoEspecial.deleteMany({ where: { meetingId } });
    return { message: 'Créditos especiales eliminados correctamente' };
  }

  // =========================================
  // TOTAL DE CRÉDITOS EXISTENTES
  // =========================================
  async getTotalCreditos() {
    const totalCreditos = await this.prisma.creditoEspecial.count({
      where: { montoPrestado: { gt: 0 } },
    });
    return { totalCreditos };
  }

  // =========================================
  // ACTUALIZACIÓN MASIVA
  // =========================================
  async actualizarMasivo(
    filas: { id: number; monto: number; pagado?: boolean }[],
  ) {
    const actualizaciones = filas.map((fila) => {
      const m = Number(fila.monto) || 0;
      const interes = +(m * 0.02).toFixed(2);
      const total = +(m + interes).toFixed(2);

      const data: any = { montoPrestado: m, interes, totalPagar: total };

      if (typeof fila.pagado === 'boolean') {
        data.pagado = fila.pagado;
        data.estado = fila.pagado
          ? EstadoCreditoEspecial.PAGADO
          : EstadoCreditoEspecial.PENDIENTE;
        data.fechaPago = fila.pagado ? new Date() : null;
      }

      return this.prisma.creditoEspecial.update({
        where: { id: fila.id },
        data,
      });
    });

    await Promise.all(actualizaciones);
    return { message: 'Filas actualizadas correctamente' };
  }

  // =========================================
  // CRÉDITOS POR SOCIO
  // =========================================
  async getCreditosPorSocio(socioId: string) {
    return this.prisma.creditoEspecial.findMany({
      where: { socioId },
      include: { meeting: true },
      orderBy: { fechaCredito: 'desc' },
    });
  }

  // =========================================
  // SOLO TRAER SOCIOS DE LA REUNIÓN ANTERIOR
  // =========================================
  async getMesAnterior(meetingId: number) {
    const meetingActual = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meetingActual) return [];

    const reunionAnterior = await this.prisma.meeting.findFirst({
      where: {
        fecha: { lt: meetingActual.fecha },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    if (!reunionAnterior) return [];

    const registros = await this.prisma.creditoEspecial.findMany({
      where: {
        meetingId: reunionAnterior.id,
      },
      include: { socio: true },
      orderBy: { socio: { orderIndex: 'asc' } },
    });

    return registros.map((c) => ({
      nui: c.socioId,
      firstname: c.socio?.firstname,
      lastname: c.socio?.lastname,
      monto: c.montoPrestado,
      pagado: c.pagado,
    }));
  }
}
