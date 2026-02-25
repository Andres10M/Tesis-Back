import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { PrismaService } from '../prisma/prisma.service';
import { Cuenta } from '@prisma/client';

@Injectable()
export class CuentasService {
  constructor(private prisma: PrismaService) {}

  // ===============================
  // PROCESAR EXCEL
  // ===============================
  async processExcel(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Archivo no enviado');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const parseDecimal = (value: any): number => {
      if (!value) return 0;
      return Number(String(value).replace(/\./g, '').replace(',', '.'));
    };

    let filasProcesadas = 0;

    for (const row of rows) {
      const nui = String(row.nui).padStart(10, '0');
      if (!nui) continue;

      const nombres = String(row.nombres).trim();
      const apellidos = String(row.apellidos).trim();
      const grupo = String(row.grupo).trim();

      const capitalDic2024 = parseDecimal(row.capital_dic_2024);
      const aporteMensual2025 = parseDecimal(row.aporte_mensual_2025);
      const capitalJunio2025 = parseDecimal(row.capital_junio_2025);

      const category = await this.prisma.category.upsert({
        where: { name: grupo },
        update: {},
        create: { name: grupo },
      });

      await this.prisma.person.upsert({
        where: { nui },
        update: {
          firstname: nombres,
          lastname: apellidos,
          categoryId: category.id,
        },
        create: {
          nui,
          firstname: nombres,
          lastname: apellidos,
          categoryId: category.id,
        },
      });

      let cuenta: Cuenta | null =
        await this.prisma.cuenta.findFirst({
          where: { personId: nui },
        });

      if (!cuenta) {
        cuenta = await this.prisma.cuenta.create({
          data: {
            personId: nui,
            description: 'Cuenta importada desde Excel',
          },
        });
      }

      await this.prisma.finanzasCuenta.upsert({
        where: { cuentaId: cuenta.id },
        update: {
          capitalDic2024,
          aporteMensual2025,
          capitalJunio2025,
        },
        create: {
          cuentaId: cuenta.id,
          capitalDic2024,
          aporteMensual2025,
          capitalJunio2025,
        },
      });

      filasProcesadas++;
    }

    return { message: 'Importación completa', filasProcesadas };
  }

  // ===============================
  // LISTAR TODAS LAS CUENTAS
  // ===============================
  async findAll() {
    return this.prisma.cuenta.findMany({
      include: {
        person: true,
        finanzas: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  // ===============================
  // BUSCAR CUENTA POR NUI
  // ===============================
  async findByNui(nui: string) {
    return this.prisma.cuenta.findFirst({
      where: { personId: nui },
      include: {
        person: true,
        finanzas: true,
      },
    });
  }

  // ===============================
  // 🔥 RESUMEN COMPLETO DEL SOCIO
  // ===============================
  async resumenSocio(nui: string) {
    const socio = await this.prisma.person.findUnique({
      where: { nui },
      include: {
        accounts: {
          include: {
            finanzas: true,
          },
        },
        cuotas: {
          where: {
            tipo: 'INGRESO',
            pagado: true,
          },
          orderBy: {
            fechaPago: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!socio) return null;

    return {
      nui: socio.nui,
      nombre: `${socio.firstname} ${socio.lastname}`,
      esSocioActivo: socio.esSocioActivo,
      fechaIngreso: socio.fechaIngreso,
      cuotaIngresoPagada: socio.cuotas.length > 0,
      cuenta: socio.accounts[0]?.finanzas ?? null,
    };
  }
}
