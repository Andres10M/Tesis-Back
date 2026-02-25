import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocioCuentaService {
  constructor(private prisma: PrismaService) {}

  async obtenerResumenCuenta(nui: string) {
    // ===============================
    // 1️⃣ SOCIO
    // ===============================
    const socio = await this.prisma.person.findUnique({
      where: { nui },
      include: {
        cuotas: true,
      },
    });

    if (!socio) {
      throw new NotFoundException('Socio no existe');
    }

    // ===============================
    // 2️⃣ CUENTA
    // ===============================
    let cuenta = await this.prisma.cuenta.findFirst({
      where: { personId: nui, active: true },
      include: {
        finanzas: true,
      },
    });

    if (!cuenta) {
      cuenta = await this.prisma.cuenta.create({
        data: {
          personId: nui,
          description: 'Cuenta principal',
          balance: 0,
          active: true,
          finanzas: {
            create: {},
          },
        },
        include: {
          finanzas: true,
        },
      });
    }

    // ===============================
    // 3️⃣ MULTAS
    // ===============================
    const multasRaw = await this.prisma.attendance.findMany({
      where: {
        socioId: nui,
        multa: { gt: 0 },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    const multas = multasRaw.map((m) => ({
      id: m.id,
      valor: Number(m.multa),
      pagada: false,
      fecha: m.fecha ?? null,
    }));

    const totalMultas = multas.reduce(
      (acc, m) => acc + m.valor,
      0,
    );

    // ===============================
    // 4️⃣ CRÉDITOS ORDINARIOS
    // ===============================
    const creditosRaw = await this.prisma.credit.findMany({
      where: {
        personId: nui,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const creditosOrdinarios = creditosRaw.map((c) => {
      const monto = Number(c.amount);
      const interes = Number(c.interestRate);
      const total = monto + interes;

      return {
        tipo: 'Crédito Ordinario', // 🔥 SIN #ID
        monto,
        interes,
        total,
        estado: c.status,
        fecha: c.startDate ?? null,
        pagado: c.status === 'PAGADO',
      };
    });

    // ===============================
    // 5️⃣ CRÉDITOS ESPECIALES
    // ===============================
    const creditosEspecialRaw =
      await this.prisma.creditoEspecial.findMany({
        where: {
          socioId: nui,
        },
        orderBy: {
          id: 'asc',
        },
      });

    const creditosEspeciales = creditosEspecialRaw.map((c) => ({
      tipo: 'Crédito Especial', // 🔥 SIN #ID
      monto: Number(c.montoPrestado),
      interes: Number(c.interes),
      total: Number(c.totalPagar),
      estado: c.estado,
      fecha: c.fechaCredito ?? null,
      pagado: c.pagado,
    }));

    // ===============================
    // 6️⃣ UNIFICAR CRÉDITOS
    // ===============================
    const todosCreditos = [
      ...creditosOrdinarios,
      ...creditosEspeciales,
    ];

    const tieneCreditosPendientes = todosCreditos.some(
      (c) => !c.pagado,
    );

    const totalCreditos = todosCreditos.reduce(
      (acc, c) => acc + c.total,
      0,
    );

    // ===============================
    // 7️⃣ CAPITAL
    // ===============================
    const capital =
      Number(cuenta.finanzas?.capitalJunio2025 ?? 0) -
      totalMultas;

    // ===============================
    // 8️⃣ CUOTA DE INGRESO
    // ===============================
    const cuotaIngreso = socio.cuotas.find(
      (c) => c.tipo === 'INGRESO' && c.pagado,
    );

    // ===============================
    // 9️⃣ MENSAJE INSTITUCIONAL
    // ===============================
    let mensajeInstitucional =
      'El socio se encuentra habilitado para formar parte de la cooperativa y participar en sus actividades institucionales.';

    if (socio.fechaIngreso) {
      mensajeInstitucional +=
        '\nA partir de 12 meses de permanencia podrá acceder a créditos ordinarios, créditos especiales y beneficios cooperativos.';
    }

    // ===============================
    // 🔟 ESTADO DE CUENTA
    // ===============================
    const estadoCuenta =
      totalMultas > 0 || tieneCreditosPendientes
        ? 'DEUDA'
        : 'AL_DIA';

    // ===============================
    // 1️⃣1️⃣ RESPUESTA FINAL
    // ===============================
    return {
      cedula: socio.nui,
      nombre: `${socio.firstname} ${socio.lastname}`,
      capital,
      creditos: todosCreditos,
      totalCreditos,
      multas,
      totalMultas,
      estadoCuenta,
      socio: {
        cedula: socio.nui,
        nombre: `${socio.firstname} ${socio.lastname}`,
        activoDesde: socio.fechaIngreso,
        esSocioActivo: socio.esSocioActivo,
      },
      cuotaIngreso: {
        estado: cuotaIngreso ? 'PAGADA' : 'PENDIENTE',
        fechaPago: cuotaIngreso?.fechaPago ?? null,
      },
      mensajeInstitucional,
    };
  }
}
