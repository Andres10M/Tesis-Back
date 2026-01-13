import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function importarSocios() {
  console.log("📂 Leyendo archivo socios.xlsx...");

  const workbook = XLSX.readFile("socios.xlsx");
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data: any[] = XLSX.utils.sheet_to_json(sheet);

  console.log(`👥 ${data.length} socios encontrados`);

  for (const socio of data) {
    await prisma.person.upsert({
      where: { nui: String(socio.nui) },
      update: {},
      create: {
        nui: String(socio.nui),
        firstname: socio.firstname,
        lastname: socio.lastname,
        status: true
      }
    });

    console.log(`✅ Socio guardado: ${socio.firstname} ${socio.lastname}`);
  }

  console.log("🎉 IMPORTACIÓN FINALIZADA");
  process.exit();
}

importarSocios();
