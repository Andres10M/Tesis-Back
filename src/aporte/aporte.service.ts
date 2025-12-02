import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAporteDto } from './dto/create-aporte.dto';

@Injectable()
export class AporteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAporteDto) {
    const { cuenta_id, mes, anio } = dto;

    // Verificar que no exista aporte duplicado
    const existing = await this.prisma.aporte.findFirst({
      where: { cuenta_id, mes, anio }
    });

    if (existing) {
      throw new BadRequestException('El aporte de este mes ya está registrado');
    }

    return await this.prisma.aporte.create({
      data: {
        cuenta_id,
        mes,
        anio,
        amount: 2, // siempre $2
      }
    });
  }

  async findAll() {
    return await this.prisma.aporte.findMany({
      include: {
        cuenta: true
      }
    });
  }
}
