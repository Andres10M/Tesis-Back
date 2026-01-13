-- CreateTable
CREATE TABLE "FinanzasCuenta" (
    "id" SERIAL NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "capitalDic2024" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "aporteMensual2025" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "capitalJunio2025" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanzasCuenta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinanzasCuenta_cuentaId_key" ON "FinanzasCuenta"("cuentaId");

-- AddForeignKey
ALTER TABLE "FinanzasCuenta" ADD CONSTRAINT "FinanzasCuenta_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
