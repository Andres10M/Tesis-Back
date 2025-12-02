-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "multa" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "observacion" TEXT;

-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_reunion_id_fkey" FOREIGN KEY ("reunion_id") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
