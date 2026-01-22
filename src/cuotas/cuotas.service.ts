
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TipoCuota } from '@prisma/client';

@Injectable()
export class CuotasService {
  constructor(private prisma: PrismaService) {}

  // =====================================================
  // 🔥 CREAR CUOTAS AUTOMÁTICAS AL CREAR REUNIÓN
  // =====================================================
  async crearCuotasPorReunion(meetingId: number) {
    const socios = await this.prisma.person.findMany({
      where: {
        status: true,
        isDelete: false,
      },
      orderBy: {
        orderIndex: 'asc',
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

    console.log('💰 CUOTAS AUTOMÁTICAS CREADAS', meetingId);
  }

  // =====================================================
  // ✅ GUARDAR CUOTAS MASIVAS (FIX DEFINITIVO)
  // =====================================================
  async guardarCuotaMasiva(
    meetingId: number,
    tipo: TipoCuota,
    sociosPagados: string[],
    usuario = 'sistema',
  ) {
    // 🔥 1. RESETEAR TODAS LAS CUOTAS DE ESE TIPO
    await this.prisma.cuotaSocio.updateMany({
      where: {
        meetingId,
        tipo,
      },
      data: {
        pagado: false,
        fechaPago: null,
        registradoPor: null,
      },
    });

    // 🔥 2. MARCAR SOLO LOS SELECCIONADOS
    if (sociosPagados.length > 0) {
      await this.prisma.cuotaSocio.updateMany({
        where: {
          meetingId,
          tipo,
          socioId: { in: sociosPagados },
        },
        data: {
          pagado: true,
          fechaPago: new Date(),
          registradoPor: usuario,
        },
      });
    }

    const monto = tipo === TipoCuota.APORTE_2 ? 2 : 20;

    console.log('✅ CUOTAS GUARDADAS', {
      meetingId,
      tipo,
      socios: sociosPagados.length,
      total: sociosPagados.length * monto,
    });

    return {
      sociosRegistrados: sociosPagados.length,
      totalRecaudado: sociosPagados.length * monto,
    };
  }

  // =====================================================
  // 🔍 OBTENER TODAS LAS CUOTAS DE UNA REUNIÓN
  // =====================================================
  async obtenerCuotasPorReunion(meetingId: number) {
    return this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
      },
      select: {
        socioId: true,
        tipo: true,
        pagado: true,
      },
    });
  }

  // =====================================================
  // 🔍 LISTAR CUOTAS POR REUNIÓN Y TIPO
  // =====================================================
  async listarCuotasPorReunion(meetingId: number, tipo: TipoCuota) {
    return this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
        tipo,
      },
      include: {
        socio: true,
      },
      orderBy: {
        socio: {
          orderIndex: 'asc',
        },
      },
    });
  }

  // =====================================================
  // 🔍 CUOTAS PENDIENTES
  // =====================================================
  async listarCuotasPendientes(meetingId: number, tipo: TipoCuota) {
    return this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
        tipo,
        pagado: false,
      },
      include: {
        socio: true,
      },
    });
  }

  // =====================================================
  // 🔍 CUOTAS PAGADAS
  // =====================================================
  async listarCuotasPagadas(meetingId: number, tipo: TipoCuota) {
    return this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
        tipo,
        pagado: true,
      },
      include: {
        socio: true,
      },
    });
  }

  // =====================================================
  // 📊 RESUMEN TOTAL DE RECAUDACIÓN
  // =====================================================
  async resumenRecaudacion(meetingId: number) {
    const cuotas = await this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
        pagado: true,
      },
    });

    const total = cuotas.reduce(
      (sum, c) => sum + c.monto.toNumber(),
      0,
    );

    return {
      meetingId,
      totalPagos: cuotas.length,
      totalRecaudado: total,
    };
  }
}
