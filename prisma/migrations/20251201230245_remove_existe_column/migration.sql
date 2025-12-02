/*
  Warnings:

  - You are about to drop the column `reunion_id` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `socio_id` on the `attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cuenta_id,mes,anio]` on the table `Aporte` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anio` to the `Aporte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mes` to the `Aporte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reunionId` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socioId` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_reunion_id_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_socio_id_fkey";

-- AlterTable
ALTER TABLE "Aporte" ADD COLUMN     "anio" INTEGER NOT NULL,
ADD COLUMN     "mes" INTEGER NOT NULL,
ALTER COLUMN "amount" SET DEFAULT 2.00,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "reunion_id",
DROP COLUMN "socio_id",
ADD COLUMN     "justificado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reunionId" INTEGER NOT NULL,
ADD COLUMN     "socioId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Aporte_cuenta_id_mes_anio_key" ON "Aporte"("cuenta_id", "mes", "anio");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Person"("nui") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_reunionId_fkey" FOREIGN KEY ("reunionId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
