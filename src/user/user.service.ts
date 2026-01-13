
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREAR USUARIO
  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        enabled: dto.enabled ?? true,
        locked: dto.locked ?? false,
        personId: dto.personId ?? null,
      },
    });
  }

  // 📋 LISTAR
  findAll() {
    return this.prisma.user.findMany({
      include: {
        person: true,
      },
    });
  }

  // 🔍 BUSCAR
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { person: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  // ✏️ ACTUALIZAR
  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: any = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // ❌ ELIMINAR
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
