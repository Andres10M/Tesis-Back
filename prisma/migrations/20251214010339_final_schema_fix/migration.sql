/*
  Warnings:

  - You are about to drop the column `credito_id` on the `Amortization` table. All the data in the column will be lost.
  - You are about to drop the column `cuenta_id` on the `Amortization` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_calculo` on the `Amortization` table. All the data in the column will be lost.
  - You are about to drop the column `monto_interes` on the `Amortization` table. All the data in the column will be lost.
  - You are about to drop the column `cuenta_id` on the `Aporte` table. All the data in the column will be lost.
  - You are about to drop the column `cuenta_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `person_id` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Credit` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Cuenta` table. All the data in the column will be lost.
  - You are about to drop the column `estatus` on the `Cuenta` table. All the data in the column will be lost.
  - You are about to drop the column `person_id` on the `Cuenta` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `uep_id` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `cuenta_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `registrado_por` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `saldo_actual` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `reunionId` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `person_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cuentaId,mes,anio]` on the table `Aporte` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[socioId,meetingId]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creditId` to the `Amortization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuentaId` to the `Amortization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaCalculo` to the `Amortization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoInteres` to the `Amortization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuentaId` to the `Aporte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personId` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personId` to the `Cuenta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuentaId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registradoPor` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saldoActual` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingId` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Amortization" DROP CONSTRAINT "Amortization_credito_id_fkey";

-- DropForeignKey
ALTER TABLE "Amortization" DROP CONSTRAINT "Amortization_cuenta_id_fkey";

-- DropForeignKey
ALTER TABLE "Aporte" DROP CONSTRAINT "Aporte_cuenta_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit" DROP CONSTRAINT "Credit_cuenta_id_fkey";

-- DropForeignKey
ALTER TABLE "Credit" DROP CONSTRAINT "Credit_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Cuenta" DROP CONSTRAINT "Cuenta_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_uep_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_cuenta_id_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_reunionId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_person_id_fkey";

-- DropIndex
DROP INDEX "Aporte_cuenta_id_mes_anio_key";

-- DropIndex
DROP INDEX "attendance_socioId_reunionId_key";

-- DropIndex
DROP INDEX "users_person_id_key";

-- AlterTable
ALTER TABLE "Amortization" DROP COLUMN "credito_id",
DROP COLUMN "cuenta_id",
DROP COLUMN "fecha_calculo",
DROP COLUMN "monto_interes",
ADD COLUMN     "creditId" INTEGER NOT NULL,
ADD COLUMN     "cuentaId" INTEGER NOT NULL,
ADD COLUMN     "fechaCalculo" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "montoInteres" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Aporte" DROP COLUMN "cuenta_id",
ADD COLUMN     "cuentaId" INTEGER NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Credit" DROP COLUMN "cuenta_id",
DROP COLUMN "end_date",
DROP COLUMN "person_id",
DROP COLUMN "start_date",
ADD COLUMN     "cuentaId" INTEGER,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "personId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "interestRate" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Cuenta" DROP COLUMN "created_at",
DROP COLUMN "estatus",
DROP COLUMN "person_id",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "personId" TEXT NOT NULL,
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "is_delete",
DROP COLUMN "uep_id",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "cuenta_id",
DROP COLUMN "registrado_por",
DROP COLUMN "saldo_actual",
ADD COLUMN     "cuentaId" INTEGER NOT NULL,
ADD COLUMN     "registradoPor" TEXT NOT NULL,
ADD COLUMN     "saldoActual" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "monto" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "reunionId",
ADD COLUMN     "meetingId" INTEGER NOT NULL,
ALTER COLUMN "multa" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "person_id",
ADD COLUMN     "personId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Aporte_cuentaId_mes_anio_key" ON "Aporte"("cuentaId", "mes", "anio");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_socioId_meetingId_key" ON "attendance"("socioId", "meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "users_personId_key" ON "users"("personId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("nui") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("nui") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aporte" ADD CONSTRAINT "Aporte_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("nui") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuenta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amortization" ADD CONSTRAINT "Amortization_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amortization" ADD CONSTRAINT "Amortization_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
