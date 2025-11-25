import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAporteDto } from './dto/create-aporte.dto';
import { UpdateAporteDto } from './dto/update-aporte.dto';

@Injectable()
export class AporteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAporteDto) {
    // Verificar si existe una cuenta válida
    const cuenta = await this.prisma.cuenta.findUnique({
      where: { id: dto.cuenta_id }
    });

    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    return this.prisma.aporte.create({
      data: {
        amount: dto.amount,
        date: new Date(dto.date),
        cuenta_id: dto.cuenta_id,
      },
      include: { cuenta: true },
    });
  }

  findAll() {
    return this.prisma.aporte.findMany({
      include: { cuenta: true },
    });
  }

  async findOne(id: number) {
    const aporte = await this.prisma.aporte.findUnique({
      where: { id },
      include: { cuenta: true },
    });

    if (!aporte) throw new NotFoundException('Aporte no encontrado');

    return aporte;
  }

  async update(id: number, dto: UpdateAporteDto) {
    const aporte = await this.prisma.aporte.findUnique({ where: { id } });
    if (!aporte) throw new NotFoundException('Aporte no encontrado');

    return this.prisma.aporte.update({
      where: { id },
      data: {
        amount: dto.amount,
        date: dto.date ? new Date(dto.date) : undefined,
        cuenta_id: dto.cuenta_id,
      },
      include: { cuenta: true },
    });
  }

  async remove(id: number) {
    const aporte = await this.prisma.aporte.findUnique({ where: { id } });
    if (!aporte) throw new NotFoundException('Aporte no encontrado');

    return this.prisma.aporte.delete({ where: { id } });
  }
}
