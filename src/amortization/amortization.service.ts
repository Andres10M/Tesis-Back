import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmortizationDto } from './dto/create-amortization.dto';
import { UpdateAmortizationDto } from './dto/update-amortization.dto';

@Injectable()
export class AmortizationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAmortizationDto) {
    const credit = await this.prisma.credit.findUnique({
      where: { id: dto.creditId },
    });
    if (!credit) throw new NotFoundException('Crédito no encontrado');

    const cuenta = await this.prisma.cuenta.findUnique({
      where: { id: dto.cuentaId },
    });
    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');

    return this.prisma.amortization.create({
      data: {
        montoInteres: dto.montoInteres,
        fechaCalculo: new Date(dto.fechaCalculo),
        creditId: dto.creditId,
        cuentaId: dto.cuentaId,
      },
      include: {
        credit: true,
        cuenta: true,
      },
    });
  }

  findAll() {
    return this.prisma.amortization.findMany({
      include: { credit: true, cuenta: true },
      orderBy: { fechaCalculo: 'desc' },
    });
  }

  async findOne(id: number) {
    const amort = await this.prisma.amortization.findUnique({
      where: { id },
      include: { credit: true, cuenta: true },
    });
    if (!amort) throw new NotFoundException('Amortización no encontrada');
    return amort;
  }

  async update(id: number, dto: UpdateAmortizationDto) {
    await this.findOne(id);

    return this.prisma.amortization.update({
      where: { id },
      data: {
        montoInteres: dto.montoInteres,
        fechaCalculo: dto.fechaCalculo
          ? new Date(dto.fechaCalculo)
          : undefined,
        creditId: dto.creditId,
        cuentaId: dto.cuentaId,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.amortization.delete({ where: { id } });
  }
}
