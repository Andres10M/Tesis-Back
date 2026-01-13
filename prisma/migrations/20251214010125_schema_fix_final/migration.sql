/*
  Warnings:

  - You are about to alter the column `monto_interes` on the `Amortization` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `amount` on the `Aporte` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `amount` on the `Credit` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `interestRate` on the `Credit` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(5,2)`.
  - You are about to alter the column `balance` on the `Cuenta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `multa` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the `Transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_cuenta_id_fkey";

-- AlterTable
ALTER TABLE "Amortization" ALTER COLUMN "monto_interes" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Aporte" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Credit" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "interestRate" SET DATA TYPE DECIMAL(5,2);

-- AlterTable
ALTER TABLE "Cuenta" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "attendance" ALTER COLUMN "multa" SET DATA TYPE DECIMAL(10,2);

-- DropTable
DROP TABLE "Transactions";

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "cuenta_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "registrado_por" TEXT NOT NULL,
    "saldo_actual" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "Cuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
