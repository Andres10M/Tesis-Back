import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import path from 'path'

const prisma = new PrismaClient()

const fileName = 'creditos_2024_12.xlsx'

// 👉 lo sacas del nombre del archivo
const anio = 2024
const mes = 12

function parseNumber(v: any): number {
  if (!v) return 0
  return Number(String(v).replace(',', '.'))
}

async function main() {
  const filePath = path.join(__dirname, fileName)
  const workbook = XLSX.readFile(filePath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null })

  for (const row of rows) {
    const nui = String(row.nui).trim()

    if (!/^\d{10}$/.test(nui)) continue

    // aseguramos que el socio exista
    const person = await prisma.person.findUnique({
      where: { nui },
    })
    if (!person) continue

    // evitar subir dos veces el mismo mes
    const exists = await prisma.creditoEspecial.findFirst({
      where: { socioId: nui, anio, mes },
    })
    if (exists) continue

    await prisma.creditoEspecial.create({
      data: {
        socioId: nui,
        montoPrestado: parseNumber(row.monto_prestado),
        interes: parseNumber(row.interes),
        totalPagar: parseNumber(row.total_pagar),
        fechaCredito: new Date(row.fecha_credito),
        anio,
        mes,
      },
    })

    console.log(`✅ Crédito cargado: ${nui}`)
  }

  console.log('🎉 Excel cargado sin romper nada')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
