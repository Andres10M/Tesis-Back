import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

      // ============================
      // 🔒 VALIDACIONES DE SOCIO
      // ============================

      const socio = await tx.person.findUnique({
        where: { nui: data.personId },
      });

      if (!socio) {
        throw new NotFoundException('Socio no existe');
      }

      if (!socio.esSocioActivo || !socio.fechaIngreso) {
        throw new BadRequestException(
          'El socio no está habilitado para créditos',
        );
      }

      const hoy = new Date();
      const fechaMinima = new Date(socio.fechaIngreso);
      fechaMinima.setFullYear(fechaMinima.getFullYear() + 1);

      if (hoy < fechaMinima) {
        throw new BadRequestException(
          'El socio debe cumplir mínimo 1 año para acceder a créditos',
        );
      }

      const totalCreditos = await tx.credit.aggregate({
        where: {
          personId: socio.nui,
          status: 'ACTIVO',
        },
        _sum: {
          amount: true,
        },
      });

      const usado = totalCreditos._sum.amount?.toNumber() || 0;
      const limite = socio.limiteCredito?.toNumber() || 0;

      if (usado + data.amount > limite) {
        throw new BadRequestException(
          'El monto solicitado supera el límite de crédito permitido',
        );
      }

      // ============================
      // 1️⃣ Buscar cuenta (TU CÓDIGO)
      // ============================

      const cuenta = await tx.cuenta.findUnique({
        where: { id: data.cuentaId },
      });

      if (!cuenta) {
        throw new NotFoundException('La cuenta no existe');
      }

      // ============================
      // 2️⃣ Crear crédito (TU CÓDIGO)
      // ============================

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

      // ============================
      // 3️⃣ Calcular nuevo saldo
      // ============================

      const nuevoSaldo =
        cuenta.balance.toNumber() + data.amount;

      // ============================
      // 4️⃣ Actualizar balance
      // ============================

      await tx.cuenta.update({
        where: { id: cuenta.id },
        data: {
          balance: new Decimal(nuevoSaldo),
        },
      });

      // ============================
      // 5️⃣ Registrar transacción
      // ============================

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
