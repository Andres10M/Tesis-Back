import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.person.findMany({
      where: { isDelete: false },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async create(dto: CreatePersonDto) {
    const exists = await this.prisma.person.findUnique({
      where: { nui: dto.nui },
    });

    if (exists) {
      throw new BadRequestException('La cédula ya existe');
    }

    // Por defecto status false si no viene
    const created = await this.prisma.person.create({
      data: {
        ...dto,
        status: dto.status ?? false,
        isDelete: false,
      },
    });
    console.log(`✅ Socio creado: ${created.firstname} ${created.lastname} (${created.nui})`);
    return created;
  }

  async updateSafe(oldNui: string, dto: UpdatePersonDto) {
    const person = await this.prisma.person.findUnique({
      where: { nui: oldNui },
    });

    if (!person) {
      throw new BadRequestException('Socio no encontrado');
    }

    if (!dto.nui || dto.nui === oldNui) {
      const updated = await this.prisma.person.update({
        where: { nui: oldNui },
        data: {
          firstname: dto.firstname ?? person.firstname,
          lastname: dto.lastname ?? person.lastname,
          address: dto.address ?? person.address,
          phone: dto.phone ?? person.phone,
          status: dto.status ?? person.status,
          categoryId: dto.categoryId ?? person.categoryId,
        },
      });
      console.log(`✏️ Socio actualizado (sin cambio de cédula): ${updated.firstname} ${updated.lastname} (${updated.nui})`);
      return updated;
    }

    return this.prisma.$transaction(async tx => {
      const exists = await tx.person.findUnique({
        where: { nui: dto.nui! },
      });

      if (exists) {
        throw new BadRequestException('La nueva cédula ya existe');
      }

      const created = await tx.person.create({
        data: {
          nui: dto.nui!,
          firstname: dto.firstname ?? person.firstname,
          lastname: dto.lastname ?? person.lastname,
          address: person.address,
          phone: person.phone,
          status: person.status,
          categoryId: person.categoryId,
          orderIndex: person.orderIndex,
          isDelete: false,
        },
      });

      await tx.attendance.updateMany({
        where: { socioId: oldNui },
        data: { socioId: dto.nui! },
      });

      await tx.person.update({
        where: { nui: oldNui },
        data: { isDelete: true },
      });

      console.log(`✏️ Socio actualizado con cambio de cédula: ${created.firstname} ${created.lastname} (${created.nui})`);
      return created;
    });
  }

  async remove(nui: string) {
    const removed = await this.prisma.person.update({
      where: { nui },
      data: { isDelete: true },
    });

    console.log(`🗑️ Socio eliminado: ${removed.firstname} ${removed.lastname} (${removed.nui})`);
    return { message: 'Socio eliminado correctamente' };
  }
}
