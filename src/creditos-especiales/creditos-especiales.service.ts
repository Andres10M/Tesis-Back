import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditosEspecialesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.creditoEspecial.findMany({
      include: {
        socio: {
          select: {
            nui: true,
            firstname: true,
            lastname: true,
          },
        },
        abonos: true,
      },
      orderBy: [
        { anio: 'desc' },
        { mes: 'desc' },
      ],
    });
  }

  async findByNui(nui: string) {
    return this.prisma.creditoEspecial.findMany({
      where: {
        socioId: nui,
      },
      include: {
        socio: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        abonos: true,
      },
      orderBy: {
        fechaCredito: 'desc',
      },
    });
  }

  async findByPeriodo(anio: number, mes: number) {
    return this.prisma.creditoEspecial.findMany({
      where: { anio, mes },
      include: {
        socio: true,
        abonos: true,
      },
    });
  }
}
