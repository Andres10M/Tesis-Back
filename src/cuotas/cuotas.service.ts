import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TipoCuota } from '@prisma/client';

@Injectable()
export class CuotasService {
  constructor(private prisma: PrismaService) {}

  // ==================================================
  // Crear cuotas automáticas al crear reunión
  // ==================================================
  async crearCuotasPorReunion(meetingId: number) {
    // SOLO socios activos
    const socios = await this.prisma.person.findMany({
      where: {
        status: true,
        isDelete: false,
      },
    });

    const cuotas = socios.flatMap((s) => [
      {
        socioId: s.nui,
        meetingId,
        tipo: TipoCuota.APORTE_2,
        monto: 2,
        pagado: false,
      },
      {
        socioId: s.nui,
        meetingId,
        tipo: TipoCuota.CUOTA_20,
        monto: 20,
        pagado: false,
      },
    ]);

    await this.prisma.cuotaSocio.createMany({
      data: cuotas,
      skipDuplicates: true,
    });
  }

  // ==================================================
  // Guardar cuotas masivas
  // ==================================================
  async guardarCuotaMasiva(body: {
    meetingId: number;
    pagos2: Record<string, boolean>;
    pagos20: Record<string, boolean>;
  }) {
    const { meetingId, pagos2, pagos20 } = body;

    // APORTE 2
    for (const nui in pagos2) {
      await this.prisma.cuotaSocio.upsert({
        where: {
          socioId_meetingId_tipo: {
            socioId: nui,
            meetingId,
            tipo: TipoCuota.APORTE_2,
          },
        },
        update: {
          pagado: pagos2[nui],
          fechaPago: pagos2[nui] ? new Date() : null,
        },
        create: {
          socioId: nui,
          meetingId,
          tipo: TipoCuota.APORTE_2,
          monto: 2,
          pagado: pagos2[nui],
          fechaPago: pagos2[nui] ? new Date() : null,
        },
      });
    }

    // CUOTA 20
    for (const nui in pagos20) {
      await this.prisma.cuotaSocio.upsert({
        where: {
          socioId_meetingId_tipo: {
            socioId: nui,
            meetingId,
            tipo: TipoCuota.CUOTA_20,
          },
        },
        update: {
          pagado: pagos20[nui],
          fechaPago: pagos20[nui] ? new Date() : null,
        },
        create: {
          socioId: nui,
          meetingId,
          tipo: TipoCuota.CUOTA_20,
          monto: 20,
          pagado: pagos20[nui],
          fechaPago: pagos20[nui] ? new Date() : null,
        },
      });
    }

    return { ok: true };
  }

  // ==================================================
  // Obtener cuotas por reunión
  // ==================================================
  async obtenerCuotasPorReunion(meetingId: number) {
    return this.prisma.cuotaSocio.findMany({
      where: { meetingId },
      select: {
        socioId: true,
        tipo: true,
        pagado: true,
      },
    });
  }

  // ==================================================
  // Totales reales (no se reducen jamás)
  // ==================================================
  async obtenerTotalesReales(meetingId: number) {
    const cuotas = await this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
        pagado: true,
      },
    });

    const total2 = cuotas
      .filter((c) => c.tipo === TipoCuota.APORTE_2)
      .reduce((s, c) => s + c.monto.toNumber(), 0);

    const total20 = cuotas
      .filter((c) => c.tipo === TipoCuota.CUOTA_20)
      .reduce((s, c) => s + c.monto.toNumber(), 0);

    return {
      total2,
      total20,
      totalGeneral: total2 + total20,
    };
  }

  // ==================================================
  // Pagar cuota de ingreso y activar socio
  // ==================================================
  async pagarCuotaIngreso(nui: string, monto = 275) {
    const socio = await this.prisma.person.findUnique({ where: { nui } });

    if (!socio) throw new NotFoundException('Socio no encontrado');
    if (socio.status) throw new BadRequestException('El socio ya está activo');

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Registrar cuota de ingreso
      await tx.cuotaSocio.create({
        data: {
          socioId: nui,
          tipo: TipoCuota.INGRESO,
          monto,
          pagado: true,
          fechaPago: new Date(),
        },
      });

      // 2️⃣ Crear cuenta principal
      const cuenta = await tx.cuenta.create({
        data: {
          personId: nui,
          description: 'Cuenta principal',
          balance: 395, // 275 + 120
          active: true,
        },
      });

      // 3️⃣ Crear finanzas
      await tx.finanzasCuenta.create({
        data: {
          cuentaId: cuenta.id,
          capitalDic2024: 0,
          aporteMensual2025: 120,
          capitalJunio2025: 395,
        },
      });

      // 4️⃣ Registrar aporte mensual
      await tx.aporte.create({
        data: {
          cuentaId: cuenta.id,
          amount: 120,
          anio: 2025,
          mes: 1,
        },
      });

      // 5️⃣ Activar socio
      await tx.person.update({
        where: { nui },
        data: { status: true, esSocioActivo: true },
      });

      return { ok: true };
    });
  }

  // ==================================================
  // Listar socios activos (solo quienes pagaron cuota de ingreso)
  // ==================================================
  async listarSociosActivos() {
    return this.prisma.person.findMany({
      where: { status: true, isDelete: false, esSocioActivo: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  // ==================================================
  // Listar socios pendientes de cuota de ingreso
  // ==================================================
  async listarSociosPendientesIngreso() {
    return this.prisma.person.findMany({
      where: { status: false, isDelete: false, esSocioActivo: false },
      orderBy: { orderIndex: 'asc' },
    });
  }

  // ==================================================
  // Resumen de recaudación por reunión
  // ==================================================
  async resumenRecaudacion(meetingId: number) {
    const cuotas = await this.prisma.cuotaSocio.findMany({
      where: { meetingId, pagado: true },
    });

    const total = cuotas.reduce((sum, c) => sum + c.monto.toNumber(), 0);

    return {
      totalPagos: cuotas.length,
      totalRecaudado: total,
    };
  }
}
