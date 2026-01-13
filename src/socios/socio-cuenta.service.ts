import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocioCuentaService {
  constructor(private prisma: PrismaService) {}

  async obtenerResumenCuenta(nui: string) {
    const socio = await this.prisma.person.findUnique({
      where: { nui },
    });

    if (!socio) {
      throw new NotFoundException('Socio no existe');
    }

    let cuenta = await this.prisma.cuenta.findFirst({
      where: { personId: nui, active: true },
      include: {
        credits: true,
        finanzas: true,
      },
    });

    if (!cuenta) {
      cuenta = await this.prisma.cuenta.create({
        data: {
          personId: nui,
          description: 'Cuenta principal',
          balance: 0,
          finanzas: {
            create: {},
          },
        },
        include: {
          credits: true,
          finanzas: true,
        },
      });
    }

    const multasRaw = await this.prisma.attendance.findMany({
      where: {
        socioId: nui,
        multa: { gt: 0 },
      },
    });

    const multas = multasRaw.map((m) => ({
      id: m.id,
      valor: Number(m.multa),
      pagada: Number(m.multa) === 0,
    }));

    const totalMultas = multas.reduce(
      (acc, m) => acc + m.valor,
      0,
    );

    const creditosActivos = cuenta.credits.filter(
      (c) => c.status === 'ACTIVO',
    );

    const capital =
      Number(cuenta.finanzas?.capitalJunio2025 ?? 0) -
      totalMultas;

    return {
      cedula: socio.nui,
      nombre: `${socio.firstname} ${socio.lastname}`,
      capital,
      creditos: creditosActivos.map((c) => ({
        id: c.id,
        saldo: Number(c.amount),
      })),
      multas,
      totalMultas,
      estadoCuenta:
        totalMultas > 0 || creditosActivos.length > 0
          ? 'DEUDA'
          : 'AL_DIA',
    };
  }
}
