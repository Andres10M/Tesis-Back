import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.transaction.create({ data });
  }

  findAll() {
    return this.prisma.transaction.findMany({
      include: { cuenta: true },
    });
  }

  findByCuenta(cuentaId: number) {
    return this.prisma.transaction.findMany({
      where: { cuentaId },
      orderBy: { fecha: 'desc' },
    });
  }

  remove(id: number) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
