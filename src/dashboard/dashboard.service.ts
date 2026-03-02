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

      // 💰 TOTAL REAL DE AHORROS (desde FinanzasCuenta)
      this.prisma.finanzasCuenta.aggregate({
        _sum: {
          capitalJunio2025: true,
        },
      }),

      // 💳 Créditos normales activos (SUMA REAL)
      this.prisma.credit.aggregate({
        where: {
          status: 'ACTIVO',
        },
        _sum: {
          amount: true,
        },
      }),

      // 💳 Créditos especiales pendientes (SUMA REAL)
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

    // 💰 TOTAL AHORROS CORRECTO
    const totalAhorros =
      finanzas._sum?.capitalJunio2025?.toNumber() || 0;

    // 💳 TOTAL CRÉDITOS
    const totalCreditosActivos =
      (creditosNormales._sum?.amount?.toNumber() || 0) +
      (creditosEspeciales._sum?.montoPrestado?.toNumber() || 0);

    // ⚠️ TOTAL MULTAS
    const totalMultasPendientes =
      multasPendientes._sum?.multa?.toNumber() || 0;

    // 📅 Total recaudado última reunión
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

      totalRecaudadoUltimaReunion =
        cuotas._sum?.monto?.toNumber() || 0;
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