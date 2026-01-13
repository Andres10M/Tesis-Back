import { IsInt, IsString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  cuentaId: number;

  @IsString()
  tipo: string; // INGRESO | EGRESO

  @IsNumber()
  monto: number;

  @IsString()
  registradoPor: string;
}
