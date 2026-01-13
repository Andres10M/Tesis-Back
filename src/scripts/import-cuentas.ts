import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

/* =========================
   UTILIDADES
========================= */

const parseDecimal = (v: any): number => {
  if (!v) return 0;

  const value = String(v).trim();

  if (
    value === '' ||
    value.toLowerCase() === 'nulo' ||
    value.toLowerCase() === 'indefinido'
  ) {
    return 0;
  }

  return Number(value.replace(',', '.'));
};

const normalizeNui = (v: any): string | null => {
  if (!v) return null;

  const nui = String(v).replace(/\D/g, '');
  if (nui.length !== 10) return null;

  return nui;
};

/* =========================
   MAIN
========================= */

async function main() {
  const workbook = XLSX.readFile('cuentas.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    raw: false, // 👈 clave
  });

  console.log('📄 Filas leídas:', rows.length);

  let totalCapitalDic = 0;
  let totalAporte = 0;
  let totalCapitalJunio = 0;

  for (const row of rows) {
    const nui = normalizeNui(row.nui);

    // ❌ IGNORAR FILAS SIN CÉDULA
    if (!nui) continue;

    const nombres = String(row.nombres ?? '').trim();
    const apellidos = String(row.apellidos ?? '').trim();
    const grupo = String(row.grupo ?? '').trim();

    const capitalDic2024 = parseDecimal(row.capital_dic_2024);
    const aporteMensual2025 = parseDecimal(row.aporte_mensual_2025);
    const capitalJunio2025 = parseDecimal(row.capital_junio_2025);

    totalCapitalDic += capitalDic2024;
    totalAporte += aporteMensual2025;
    totalCapitalJunio += capitalJunio2025;

    console.log('➡️ Procesando:', nui, nombres, apellidos);

    /* PERSONA */
    await prisma.person.upsert({
      where: { nui },
      update: {
        firstname: nombres,
        lastname: apellidos,
      },
      create: {
        nui,
        firstname: nombres,
        lastname: apellidos,
        status: true,
      },
    });

    /* CUENTA */
    let cuenta = await prisma.cuenta.findFirst({
      where: { personId: nui },
    });

    if (!cuenta) {
      cuenta = await prisma.cuenta.create({
        data: {
          personId: nui,
          description: grupo,
        },
      });
    }

    /* FINANZAS */
    await prisma.finanzasCuenta.upsert({
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
  }

  /* =========================
     TOTALES CORRECTOS
  ========================= */

  console.log('==============================');
  console.log('TOTAL GENERAL');
  console.log('Capital Dic 2024:', totalCapitalDic.toFixed(2));
  console.log('Aporte Mensual 2025:', totalAporte.toFixed(2));
  console.log('Capital Junio 2025:', totalCapitalJunio.toFixed(2));
  console.log('==============================');

  console.log('✅ Importación correcta y limpia');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
