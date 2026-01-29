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

  // Crear cuotas automáticas al crear reunión
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

  // Pagar cuota de ingreso y activar socio
  async pagarCuotaIngreso(
    nui: string,
    monto = 275,  // Cambiado a 275 directamente
    usuario = 'sistema',
  ) {
    const socio = await this.prisma.person.findUnique({
      where: { nui },
    });

    if (!socio) {
      throw new NotFoundException('Socio no encontrado');
    }

    if (socio.status) {
      throw new BadRequestException('El socio ya está activo');
    }

    // Registrar cuota de ingreso
    await this.prisma.cuotaSocio.create({
      data: {
        socioId: nui,
        tipo: TipoCuota.INGRESO,
        monto,
        pagado: true,
        fechaPago: new Date(),
        registradoPor: usuario,
        meetingId: null,
      },
    });

    // Activar socio
    await this.prisma.person.update({
      where: { nui },
      data: {
        status: true,
        isDelete: false,
      },
    });

    console.log(`✅ Socio ${socio.firstname} ${socio.lastname} activado pagando cuota de ingreso`);

    return { message: 'Socio activado correctamente' };
  }

  // Listar socios pendientes de ingreso (status = false)
  async listarSociosPendientesIngreso() {
    return this.prisma.person.findMany({
      where: {
        status: false,
        isDelete: false,
      },
      orderBy: {
        lastname: 'asc',
      },
    });
  }

  // Guardar cuotas masivas
  async guardarCuotaMasiva(
    meetingId: number,
    tipo: TipoCuota,
    sociosPagados: string[],
    usuario = 'sistema',
  ) {
    await this.prisma.cuotaSocio.updateMany({
      where: { meetingId, tipo },
      data: {
        pagado: false,
        fechaPago: null,
        registradoPor: null,
      },
    });

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

    return {
      sociosRegistrados: sociosPagados.length,
      totalRecaudado: sociosPagados.length * monto,
    };
  }

  // Obtener cuotas por reunión
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

  // Listar cuotas por reunión y tipo
  async listarCuotasPorReunion(meetingId: number, tipo: TipoCuota) {
    return this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
        tipo,
      },
      include: { socio: true },
      orderBy: {
        socio: { orderIndex: 'asc' },
      },
    });
  }

  // Listar cuotas pendientes por reunión y tipo
  async listarCuotasPendientes(meetingId: number, tipo: TipoCuota) {
    return this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
        tipo,
        pagado: false,
      },
      include: { socio: true },
    });
  }

  // Listar cuotas pagadas por reunión y tipo
  async listarCuotasPagadas(meetingId: number, tipo: TipoCuota) {
    return this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
        tipo,
        pagado: true,
      },
      include: { socio: true },
    });
  }

  // Resumen total de recaudación
  async resumenRecaudacion(meetingId: number) {
    const cuotas = await this.prisma.cuotaSocio.findMany({
      where: {
        meetingId,
        pagado: true,
      },
    });

    const total = cuotas.reduce((sum, c) => sum + c.monto.toNumber(), 0);

    return {
      meetingId,
      totalPagos: cuotas.length,
      totalRecaudado: total,
    };
  }
}
