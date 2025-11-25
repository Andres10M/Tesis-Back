import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';

@Injectable()
export class FinesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateFineDto) {
    return this.prisma.fines.create({
      data,
    });
  }

  findAll() {
    return this.prisma.fines.findMany();
  }

  findOne(id_multa: number) {
    return this.prisma.fines.findUnique({
      where: { id_multa },
    });
  }

  update(id_multa: number, data: UpdateFineDto) {
    return this.prisma.fines.update({
      where: { id_multa },
      data,
    });
  }

  remove(id_multa: number) {
    return this.prisma.fines.delete({
      where: { id_multa },
    });
  }
}
