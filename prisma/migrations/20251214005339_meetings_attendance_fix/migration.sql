/*
  Warnings:

  - You are about to drop the `Fines` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[socioId,reunionId]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `estado` on the `attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('ASISTIO', 'TARDE', 'FALTA');

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoAsistencia" NOT NULL;

-- DropTable
DROP TABLE "Fines";

-- CreateIndex
CREATE UNIQUE INDEX "attendance_socioId_reunionId_key" ON "attendance"("socioId", "reunionId");
