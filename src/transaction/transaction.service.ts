import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {
    const cuenta = await this.prisma.cuenta.findUnique({
      where: { id: dto.cuenta_id },
    });

    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');

    // Ajuste de saldo
    let nuevoSaldo = cuenta.balance.toNumber();

    if (dto.tipo.toLowerCase() === 'ingreso') {
      nuevoSaldo += dto.monto;
    } else if (dto.tipo.toLowerCase() === 'egreso') {
      nuevoSaldo -= dto.monto;
      if (nuevoSaldo < 0) throw new BadRequestException('Saldo insuficiente');
    } else {
      throw new BadRequestException('Tipo inválido: use ingreso o egreso');
    }

    // Crear transacción
    const transaction = await this.prisma.transactions.create({
      data: {
        cuenta_id: dto.cuenta_id,
        tipo: dto.tipo,
        monto: dto.monto,
        fecha: dto.fecha ? new Date(dto.fecha) : undefined,
        description: dto.description,
        registrado_por: dto.registrado_por,
        saldo_actual: nuevoSaldo,
      },
      include: {
        cuenta: true,
      },
    });

    // Actualizar balance en la cuenta
    await this.prisma.cuenta.update({
      where: { id: dto.cuenta_id },
      data: { balance: nuevoSaldo },
    });

    return transaction;
  }

  async findAll() {
    return this.prisma.transactions.findMany({
      include: { cuenta: true },
    });
  }

  async findOne(id: number) {
    const tx = await this.prisma.transactions.findUnique({
      where: { id },
      include: { cuenta: true },
    });

    if (!tx) throw new NotFoundException('Transacción no encontrada');

    return tx;
  }

  async update(id: number, dto: UpdateTransactionDto) {
    const exists = await this.prisma.transactions.findUnique({
      where: { id },
    });

    if (!exists) throw new NotFoundException('Transacción no encontrada');

    return this.prisma.transactions.update({
      where: { id },
      data: dto,
      include: { cuenta: true },
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.transactions.findUnique({
      where: { id },
    });

    if (!exists) throw new NotFoundException('Transacción no encontrada');

    await this.prisma.transactions.delete({
      where: { id },
    });

    return { message: 'Transacción eliminada correctamente' };
  }
}
