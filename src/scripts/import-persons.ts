import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

function normalizeNui(nui: any): string {
  return String(nui).trim().padStart(10, '0');
}

function normalizeLastname(lastname: string): string {
  const parts = String(lastname).trim().split(/\s+/);
  if (parts.length === 2) {
    return `${parts[1]} ${parts[0]}`;
  }
  return String(lastname).trim();
}

async function main() {
  const workbook = XLSX.readFile('socios.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const dataRaw: any[] = XLSX.utils.sheet_to_json(sheet);

  console.log('Filas leídas del Excel:', dataRaw.length);

  const data = dataRaw.map(row => ({
    nui: normalizeNui(row['Cédula'] || row['nui'] || row['NUI']),
    firstname: String(row['Nombres'] || row['firstname']).trim(),
    lastname: normalizeLastname(row['Apellidos'] || row['lastname']),
  }));

  let order = 1;
  for (const socio of data) {
    if (!socio.nui || !socio.firstname || !socio.lastname) {
      console.log(`Fila ignorada (datos incompletos):`, socio);
      continue;
    }
    await prisma.person.upsert({
      where: { nui: socio.nui },
      update: {
        firstname: socio.firstname,
        lastname: socio.lastname,
        orderIndex: order,
      },
      create: {
        nui: socio.nui,
        firstname: socio.firstname,
        lastname: socio.lastname,
        orderIndex: order,
      },
    });
    order++;
  }

  console.log('✅ Socios importados correctamente (sin duplicados)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
