import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getResumen() {
    const hoy = new Date();

    // 👥 Total socios activos
    const totalSocios = await this.prisma.person.count({
      where: {
        esSocioActivo: true,
        isDelete: false,
      },
    });

    // 💰 Total ahorros acumulados
    const cuentas = await this.prisma.cuenta.aggregate({
      _sum: { balance: true },
    });

    const totalAhorros = cuentas._sum.balance?.toNumber() || 0;

    // 💳 Créditos activos normales
    const creditosActivos = await this.prisma.credit.count({
      where: {
        status: 'ACTIVO',
      },
    });

    // 💳 Créditos especiales pendientes
    const creditosEspecialesActivos =
      await this.prisma.creditoEspecial.count({
        where: {
          estado: 'PENDIENTE',
        },
      });

    const totalCreditosActivos =
      creditosActivos + creditosEspecialesActivos;

    // 📅 Última reunión cerrada
    const ultimaReunion = await this.prisma.meeting.findFirst({
      where: {
        isClosed: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

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
        cuotas._sum.monto?.toNumber() || 0;
    }

    // ⚠️ Multas pendientes
    const multasPendientes = await this.prisma.attendance.aggregate({
      where: {
        multa: { gt: 0 },
        justificado: false,
      },
      _sum: {
        multa: true,
      },
    });

    const totalMultasPendientes =
      multasPendientes._sum.multa?.toNumber() || 0;

    // 📅 Próxima reunión
    const proximaReunion = await this.prisma.meeting.findFirst({
      where: {
        fecha: { gt: hoy },
      },
      orderBy: {
        fecha: 'asc',
      },
    });

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