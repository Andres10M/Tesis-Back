import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TipoCuota } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateCuotaDto {
  @IsString()
  socioId: string;

  @IsEnum(TipoCuota)
  tipo: TipoCuota;

  @Type(() => Number)     // 🔥 MISMO PROBLEMA AQUÍ
  @IsNumber()
  monto: number;
}
