import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { PrismaService } from '../prisma/prisma.service';
import { Cuenta } from '@prisma/client';

@Injectable()
export class CuentasService {
  constructor(private prisma: PrismaService) {}

  // Procesar Excel
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

      // Crear o actualizar categoría
      const category = await this.prisma.category.upsert({
        where: { name: grupo },
        update: {},
        create: { name: grupo },
      });

      // Crear o actualizar persona
      await this.prisma.person.upsert({
        where: { nui },
        update: { firstname: nombres, lastname: apellidos, categoryId: category.id },
        create: { nui, firstname: nombres, lastname: apellidos, categoryId: category.id },
      });

      // Crear o buscar cuenta
      let cuenta: Cuenta | null = await this.prisma.cuenta.findFirst({ where: { personId: nui } });
      if (!cuenta) {
        cuenta = await this.prisma.cuenta.create({
          data: { personId: nui, description: 'Cuenta importada desde Excel' },
        });
      }

      // Crear o actualizar finanzas
      await this.prisma.finanzasCuenta.upsert({
        where: { cuentaId: cuenta.id },
        update: { capitalDic2024, aporteMensual2025, capitalJunio2025 },
        create: { cuentaId: cuenta.id, capitalDic2024, aporteMensual2025, capitalJunio2025 },
      });

      filasProcesadas++;
    }

    return { message: 'Importación completa', filasProcesadas };
  }

  // Listar todas las cuentas
  async findAll() {
    return this.prisma.cuenta.findMany({
      include: { person: true, finanzas: true },
      orderBy: { id: 'asc' },
    });
  }

  // Buscar cuenta exacta por NUI
  async findByNui(nui: string) {
    return this.prisma.cuenta.findFirst({
      where: { personId: nui },
      include: { person: true, finanzas: true },
    });
  }
}
