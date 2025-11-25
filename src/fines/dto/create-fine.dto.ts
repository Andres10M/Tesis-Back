import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateFineDto {
  @IsNumber()
  id_socio: number;

  @IsNumber()
  id_reunion: number;

  @IsString()
  motivo: string;

  @IsNumber()
  monto: number;

  @IsDateString()
  fecha_multa: string;

  @IsString()
  estado_pago: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}
