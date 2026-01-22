import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';
import { TipoCuota } from '@prisma/client';
import { Type } from 'class-transformer';

export class CuotaMasivaDto {
  @IsEnum(TipoCuota)
  tipo: TipoCuota;

  @Type(() => Number)      // 🔥 ESTO ARREGLA EL 400
  @IsNumber()
  monto: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  sociosPagados: string[];
}
