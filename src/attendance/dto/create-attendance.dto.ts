import { IsBoolean, IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  socioId: string;

  @IsString()
  estado: string; // ASISTIO | TARDE | FALTA

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @IsBoolean()
  justificado?: boolean;

  @IsOptional()
  @IsNumber()
  multa?: number;

  @IsInt()
  reunionId: number;
}
