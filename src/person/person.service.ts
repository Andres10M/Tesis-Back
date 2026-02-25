import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  // ==================================================
  // TODOS LOS SOCIOS
  // ==================================================
  findAll() {
    return this.prisma.person.findMany({
      where: { isDelete: false },
      orderBy: { orderIndex: 'asc' },
    });
  }

  // ==================================================
  // BUSCAR PARA AUTOCOMPLETADO
  // ==================================================
  searchByName(query: string) {
    if (!query || query.length < 2) return [];

    return this.prisma.person.findMany({
      where: {
        isDelete: false,
        OR: [
          { firstname: { contains: query, mode: 'insensitive' } },
          { lastname: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { orderIndex: 'asc' },
      take: 10,
    });
  }

  // ==================================================
  // CREAR SOCIO (INACTIVO POR DEFECTO)
  // ==================================================
  async create(dto: CreatePersonDto) {
    const exists = await this.prisma.person.findUnique({
      where: { nui: dto.nui },
    });

    if (exists) throw new BadRequestException('La cédula ya existe');

    // NOTA: Aquí creamos al socio como INACTIVO
    const persona = await this.prisma.person.create({
      data: {
        ...dto,
        status: false,        // socio INACTIVO
        esSocioActivo: false, // socio INACTIVO
        isDelete: false,
        fechaIngreso: new Date(),
      },
    });

    return persona;
  }

  // ==================================================
  // ACTIVAR SOCIO Y CREAR CUENTA CON CAPITAL
  // ==================================================
  async activarSocio(nui: string) {
    const socio = await this.prisma.person.findUnique({ where: { nui } });
    if (!socio) throw new NotFoundException('Socio no encontrado');
    if (socio.status) throw new BadRequestException('El socio ya está activo');

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Crear cuenta principal
      const cuenta = await tx.cuenta.create({
        data: {
          personId: socio.nui,
          description: 'Cuenta principal',
          balance: 395, // 275 + 120
          active: true,
        },
      });

      // 2️⃣ Crear finanzas
      await tx.finanzasCuenta.create({
        data: {
          cuentaId: cuenta.id,
          capitalDic2024: 0,
          aporteMensual2025: 120,
          capitalJunio2025: 395,
        },
      });

      // 3️⃣ Registrar cuota de ingreso
      await tx.cuotaSocio.create({
        data: {
          socioId: socio.nui,
          tipo: 'INGRESO',
          monto: 275,
          pagado: true,
          fechaPago: new Date(),
        },
      });

      // 4️⃣ Registrar aporte mensual
      await tx.aporte.create({
        data: {
          cuentaId: cuenta.id,
          amount: 120,
          anio: 2025,
          mes: 1,
        },
      });

      // 5️⃣ Activar socio
      await tx.person.update({
        where: { nui },
        data: { status: true, esSocioActivo: true },
      });

      return { message: 'Socio activado y cuenta creada' };
    });
  }

  // ==================================================
  // ACTUALIZAR SOCIO (CON O SIN CAMBIO DE CÉDULA)
  // ==================================================
  async updateSafe(oldNui: string, dto: UpdatePersonDto) {
    const person = await this.prisma.person.findUnique({
      where: { nui: oldNui },
    });

    if (!person) throw new BadRequestException('Socio no encontrado');

    // SIN CAMBIO DE CÉDULA
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

      return updated;
    }

    // CON CAMBIO DE CÉDULA
    return this.prisma.$transaction(async (tx) => {
      const exists = await tx.person.findUnique({ where: { nui: dto.nui! } });
      if (exists) throw new BadRequestException('La nueva cédula ya existe');

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

      return created;
    });
  }

  // ==================================================
  // ELIMINAR SOCIO (LÓGICO)
  // ==================================================
  async remove(nui: string) {
    await this.prisma.person.update({
      where: { nui },
      data: { isDelete: true },
    });

    return { message: 'Socio eliminado correctamente' };
  }

  // ==================================================
  // LISTAR SOCIOS ACTIVOS
  // ==================================================
  async listarActivos() {
    return this.prisma.person.findMany({
      where: { isDelete: false, esSocioActivo: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  // ==================================================
  // LISTAR SOCIOS PENDIENTES DE CUOTA DE INGRESO
  // ==================================================
  async listarPendientesIngreso() {
    return this.prisma.person.findMany({
      where: { isDelete: false, esSocioActivo: false },
      orderBy: { orderIndex: 'asc' },
    });
  }
}
