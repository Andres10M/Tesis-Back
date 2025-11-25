import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  cuenta_id: number;

  @IsString()
  @IsNotEmpty()
  tipo: string;  // ingreso / egreso

  @IsNumber()
  monto: number;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  registrado_por: string;
}
