import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAporteDto } from './dto/create-aporte.dto';

@Injectable()
export class AporteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAporteDto) {
    return this.prisma.aporte.create({
      data: {
        cuentaId: dto.cuentaId,
        mes: dto.mes,
        anio: dto.anio,
        amount: 2,
      },
    });
  }

  findAll() {
    return this.prisma.aporte.findMany({
      include: { cuenta: true },
    });
  }
}
