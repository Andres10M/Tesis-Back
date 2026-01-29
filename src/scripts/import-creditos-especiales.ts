import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';

const prisma = new PrismaClient();

/* =========================
   UTILIDADES
========================= */

function normalizeNui(value: any): string | null {
  if (!value) return null;
  const nui = String(value).replace(/\D/g, '');
  return nui.length === 10 ? nui : null;
}

function parseDecimal(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  return Number(String(value).replace(',', '.'));
}

/* =========================
   MAIN
========================= */

async function main() {
  // 🔴 ARCHIVO 2025 (NO SE CONFUNDE CON 2024)
  const filePath = path.join(__dirname, 'creditos_especiales_2025_02.xlsx');

  console.log('📂 Leyendo archivo:', filePath);

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    raw: false,
  });

  console.log('📄 Filas encontradas:', rows.length);

  let insertados = 0;
  let omitidos = 0;

  for (const row of rows) {
    const nui = normalizeNui(row.nui);
    if (!nui) {
      omitidos++;
      continue;
    }

    // verificar que el socio exista
    const socio = await prisma.person.findUnique({
      where: { nui },
    });

    if (!socio) {
      console.log(`⚠️ Socio no existe: ${nui}`);
      omitidos++;
      continue;
    }

    const montoPrestado = parseDecimal(row.monto_prestado);
    const interes = parseDecimal(row.interes);
    const totalPagar = parseDecimal(row.total_pagar);
    const fechaCredito = new Date(row.fecha_credito);

    const anio = fechaCredito.getFullYear();
    const mes = fechaCredito.getMonth() + 1;

    await prisma.creditoEspecial.create({
      data: {
        socioId: nui, // o socio.id si tu modelo usa ID numérico
        montoPrestado,
        interes,
        totalPagar,
        fechaCredito,
        anio,
        mes,
      },
    });

    insertados++;
  }

  console.log('==============================');
  console.log('✅ Créditos 2025 cargados:', insertados);
  console.log('⚠️ Registros omitidos:', omitidos);
  console.log('==============================');
}

main()
  .catch((err) => {
    console.error('❌ Error al importar:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
