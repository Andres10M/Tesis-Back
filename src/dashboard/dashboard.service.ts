import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getResumen() {
    const hoy = new Date();

    const [
      totalSocios,
      finanzas,
      creditosNormales,
      creditosEspeciales,
      ultimaReunion,
      multasPendientes,
      proximaReunion,
    ] = await Promise.all([
      // 👥 Total socios activos
      this.prisma.person.count({
        where: {
          esSocioActivo: true,
          isDelete: false,
        },
      }),

      // 💰 SOLO CAPITAL CONSOLIDADO REAL
      this.prisma.finanzasCuenta.aggregate({
        _sum: {
          capitalJunio2025: true, // 👈 ESTA ES LA COLUMNA CORRECTA
        },
      }),

      // 💳 Créditos normales activos
      this.prisma.credit.aggregate({
        where: {
          status: 'ACTIVO',
        },
        _sum: {
          amount: true,
        },
      }),

      // 💳 Créditos especiales pendientes
      this.prisma.creditoEspecial.aggregate({
        where: {
          estado: 'PENDIENTE',
        },
        _sum: {
          montoPrestado: true,
        },
      }),

      // 📅 Última reunión cerrada
      this.prisma.meeting.findFirst({
        where: {
          isClosed: true,
        },
        orderBy: {
          fecha: 'desc',
        },
      }),

      // ⚠️ Multas pendientes
      this.prisma.attendance.aggregate({
        where: {
          multa: { gt: 0 },
          justificado: false,
        },
        _sum: {
          multa: true,
        },
      }),

      // 📅 Próxima reunión
      this.prisma.meeting.findFirst({
        where: {
          fecha: { gt: hoy },
        },
        orderBy: {
          fecha: 'asc',
        },
      }),
    ]);

    // 💰 TOTAL AHORROS (REDONDEADO A 2 DECIMALES)
    const totalAhorros = Number(
      (finanzas._sum?.capitalJunio2025?.toNumber() || 0).toFixed(2),
    );

    // 💳 TOTAL CRÉDITOS ACTIVOS
    const totalCreditosActivos = Number(
      (
        (creditosNormales._sum?.amount?.toNumber() || 0) +
        (creditosEspeciales._sum?.montoPrestado?.toNumber() || 0)
      ).toFixed(2),
    );

    // ⚠️ TOTAL MULTAS
    const totalMultasPendientes = Number(
      (multasPendientes._sum?.multa?.toNumber() || 0).toFixed(2),
    );

    // 📅 TOTAL RECAUDADO ÚLTIMA REUNIÓN
    let totalRecaudadoUltimaReunion = 0;

    if (ultimaReunion) {
      const cuotas = await this.prisma.cuotaSocio.aggregate({
        where: {
          meetingId: ultimaReunion.id,
          pagado: true,
        },
        _sum: {
          monto: true,
        },
      });

      totalRecaudadoUltimaReunion = Number(
        (cuotas._sum?.monto?.toNumber() || 0).toFixed(2),
      );
    }

    return {
      totalSocios,
      totalAhorros,
      totalCreditosActivos,
      totalRecaudadoUltimaReunion,
      totalMultasPendientes,
      proximaReunion,
    };
  }
}