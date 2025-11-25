import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmortizationDto } from './dto/create-amortization.dto';
import { UpdateAmortizationDto } from './dto/update-amortization.dto';

@Injectable()
export class AmortizationService {
  constructor(private prisma: PrismaService) {}

  // Crear amortización: valida existencia de crédito y cuenta
  async create(dto: CreateAmortizationDto) {
    // Verificar existencia de Credit
    const credit = await this.prisma.credit.findUnique({
      where: { id: dto.credito_id },
    });
    if (!credit) throw new NotFoundException('Credit no encontrado');

    // Verificar existencia de Cuenta
    const cuenta = await this.prisma.cuenta.findUnique({
      where: { id: dto.cuenta_id },
    });
    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');

    // Nota: la lógica de negocio para actualizar saldos o el estado del crédito
    // depende de tus reglas. Aquí solo guardamos la amortización y devolvemos registro.
    const created = await this.prisma.amortization.create({
      data: {
        monto_interes: dto.monto_interes,
        fecha_calculo: new Date(dto.fecha_calculo),
        credito_id: dto.credito_id,
        cuenta_id: dto.cuenta_id,
      },
      include: {
        credit: true,
        cuenta: true,
      },
    });

    return created;
  }

  findAll() {
    return this.prisma.amortization.findMany({
      include: {
        credit: true,
        cuenta: true,
      },
      orderBy: { fecha_calculo: 'desc' },
    });
  }

  async findOne(id: number) {
    const rec = await this.prisma.amortization.findUnique({
      where: { id },
      include: { credit: true, cuenta: true },
    });
    if (!rec) throw new NotFoundException('Amortization no encontrada');
    return rec;
  }

  async update(id: number, dto: UpdateAmortizationDto) {
    // Si viene credito_id o cuenta_id, validar existencia
    if (dto.credito_id) {
      const c = await this.prisma.credit.findUnique({ where: { id: dto.credito_id } });
      if (!c) throw new NotFoundException('Credit (nuevo) no encontrado');
    }
    if (dto.cuenta_id) {
      const cu = await this.prisma.cuenta.findUnique({ where: { id: dto.cuenta_id } });
      if (!cu) throw new NotFoundException('Cuenta (nueva) no encontrada');
    }

    const updateData: any = { ...dto };
    if (dto.fecha_calculo) updateData.fecha_calculo = new Date(dto.fecha_calculo);

    return this.prisma.amortization.update({
      where: { id },
      data: updateData,
      include: { credit: true, cuenta: true },
    });
  }

  async remove(id: number) {
    // opcional: comprobar que exista
    await this.findOne(id); // lanzará NotFound si no existe
    return this.prisma.amortization.delete({ where: { id } });
  }
}
