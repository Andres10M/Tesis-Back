import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CreditService {
  constructor(private prisma: PrismaService) {}

  async createCredit(data: {
    cuentaId: number;
    personId: string;
    amount: number;
    interestRate: number;
    startDate: Date;
    endDate?: Date;
    registradoPor: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Buscar cuenta
      const cuenta = await tx.cuenta.findUnique({
        where: { id: data.cuentaId },
      });

      // 🚨 VALIDACIÓN CLAVE
      if (!cuenta) {
        throw new NotFoundException('La cuenta no existe');
      }

      // 2️⃣ Crear crédito
      const credit = await tx.credit.create({
        data: {
          cuentaId: cuenta.id,
          personId: data.personId,
          amount: new Decimal(data.amount),
          interestRate: new Decimal(data.interestRate),
          startDate: data.startDate,
          endDate: data.endDate,
          status: 'ACTIVO',
        },
      });

      // 3️⃣ Calcular nuevo saldo
      const nuevoSaldo =
        cuenta.balance.toNumber() + data.amount;

      // 4️⃣ Actualizar balance
      await tx.cuenta.update({
        where: { id: cuenta.id },
        data: {
          balance: new Decimal(nuevoSaldo),
        },
      });

      // 5️⃣ Registrar transacción
      await tx.transaction.create({
        data: {
          cuentaId: cuenta.id,
          tipo: 'CREDITO',
          monto: new Decimal(data.amount),
          registradoPor: data.registradoPor,
          saldoActual: new Decimal(nuevoSaldo),
          description: 'Crédito otorgado',
        },
      });

      return credit;
    });
  }
}
