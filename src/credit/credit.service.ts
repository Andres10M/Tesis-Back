import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';

@Injectable()
export class CreditService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCreditDto) {
    return this.prisma.credit.create({
      data: {
        amount: dto.amount,
        interestRate: dto.interestRate,
        start_date: new Date(dto.start_date),
        end_date: dto.end_date ? new Date(dto.end_date) : null,
        status: dto.status,
        person_id: dto.person_id,
        cuenta_id: dto.cuenta_id ?? null,
      },
    });
  }

  findAll() {
    return this.prisma.credit.findMany({
      include: {
        person: true,
        cuenta: true,
        amort: true,
      },
    });
  }

  async findOne(id: number) {
    const credit = await this.prisma.credit.findUnique({
      where: { id },
      include: {
        person: true,
        cuenta: true,
        amort: true,
      },
    });

    if (!credit) throw new NotFoundException('Crédito no encontrado');
    return credit;
  }

  async update(id: number, dto: UpdateCreditDto) {
    await this.findOne(id);

    return this.prisma.credit.update({
      where: { id },
      data: {
        amount: dto.amount,
        interestRate: dto.interestRate,
        start_date: dto.start_date ? new Date(dto.start_date) : undefined,
        end_date: dto.end_date ? new Date(dto.end_date) : undefined,
        status: dto.status,
        person_id: dto.person_id,
        cuenta_id: dto.cuenta_id,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.credit.delete({
      where: { id },
    });
  }

  // Nuevo método para créditos especiales
  async findSpecialCredits() {
    const credits = await this.prisma.credit.findMany({
      where: {
        status: 'aprobado', // filtro ejemplo, cambia según tu lógica
        amount: {
          gt: 200,          // ejemplo: monto mayor a 200
        },
      },
      include: {
        person: true,
      },
    });

    return credits.map(c => ({
      id: c.id,
      fullname: `${c.person.firstname} ${c.person.lastname}`,
      amount: Number(c.amount),
      interestRate: Number(c.interestRate),
      totalToPay: Number(c.amount) + Number(c.interestRate), // suma directa, cambia si necesitas calcular % de interés
    }));
  }
}
