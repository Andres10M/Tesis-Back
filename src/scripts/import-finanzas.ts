import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

function parseNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  return Number(value);
}

async function main() {
  const filePath = path.join(__dirname, 'finanzas.xlsx');

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

  for (const row of rows) {
    const nui = String(row.nui ?? '').padStart(10, '0');

    if (!/^\d{10}$/.test(nui)) continue;

    const person = await prisma.person.findUnique({
      where: { nui },
    });
    if (!person) continue;

    let cuenta = await prisma.cuenta.findFirst({
      where: { personId: person.nui },
    });

    if (!cuenta) {
      cuenta = await prisma.cuenta.create({
        data: {
          personId: person.nui,
          description: 'Cuenta creada por importación financiera',
        },
      });
    }

    const finanza = await prisma.finanzasCuenta.findFirst({
      where: { cuentaId: cuenta.id },
    });

    if (finanza) {
      await prisma.finanzasCuenta.update({
        where: { id: finanza.id },
        data: {
          capitalDic2024: parseNumber(row.capital_dic_2024),
          aporteMensual2025: parseNumber(row.aporte_mensual_2025),
          capitalJunio2025: parseNumber(row.capital_junio_2025),
        },
      });
    } else {
      await prisma.finanzasCuenta.create({
        data: {
          cuentaId: cuenta.id,
          capitalDic2024: parseNumber(row.capital_dic_2024),
          aporteMensual2025: parseNumber(row.aporte_mensual_2025),
          capitalJunio2025: parseNumber(row.capital_junio_2025),
        },
      });
    }

    console.log(`✅ Finanzas actualizadas para ${nui}`);
  }

  console.log('🎉 Importación finalizada correctamente');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
