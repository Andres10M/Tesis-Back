import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePersonDto) {
    return this.prisma.person.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.person.findMany({
      include: {
        category: true,
        accounts: true,
        credits: true,
      },
    });
  }

  async findOne(nui: string) {
    const person = await this.prisma.person.findUnique({
      where: { nui },
      include: {
        category: true,
        accounts: true,
        credits: true,
      },
    });

    if (!person) {
      throw new NotFoundException(`Persona con NUI ${nui} no encontrada`);
    }

    return person;
  }

  async update(nui: string, dto: UpdatePersonDto) {
    await this.findOne(nui);

    return this.prisma.person.update({
      where: { nui },
      data: dto,
    });
  }

  async remove(nui: string) {
    await this.findOne(nui);

    return this.prisma.person.update({
      where: { nui },
      data: { is_delete: true },
    });
  }
}
