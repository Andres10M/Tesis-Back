import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

@Injectable()
export class CuentaService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCuentaDto) {
    return this.prisma.cuenta.create({
      data: {
        description: dto.description,
        balance: dto.balance ?? "0",
        person_id: dto.person_id,
        estatus: dto.estatus ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.cuenta.findMany({
      include: {
        person: true,
        aportes: true,
        credits: true,
        trans: true,
        amort: true,
      },
    });
  }

  async findOne(id: number) {
    const cuenta = await this.prisma.cuenta.findUnique({
      where: { id },
      include: {
        person: true,
        aportes: true,
        credits: true,
        trans: true,
        amort: true,
      },
    });

    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');
    return cuenta;
  }

  async update(id: number, dto: UpdateCuentaDto) {
    await this.findOne(id);

    return this.prisma.cuenta.update({
      where: { id },
      data: {
        description: dto.description,
        balance: dto.balance,
        person_id: dto.person_id,
        estatus: dto.estatus,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.cuenta.delete({
      where: { id },
    });
  }
}
