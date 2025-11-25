import { IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAmortizationDto {
  @IsNumber({}, { message: 'monto_interes debe ser un número' })
  monto_interes: number;

  @IsDateString({}, { message: 'fecha_calculo debe ser una fecha ISO (string)' })
  fecha_calculo: string; // ISO string

  @IsInt()
  credito_id: number;

  @IsInt()
  cuenta_id: number;
}
