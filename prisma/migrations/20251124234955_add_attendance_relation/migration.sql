-- CreateTable
CREATE TABLE "attendance" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "socio_id" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "reunion_id" INTEGER NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "Person"("nui") ON DELETE RESTRICT ON UPDATE CASCADE;
