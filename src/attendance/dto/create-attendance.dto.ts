import { EstadoAsistencia } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  socioId: string;

  @IsInt()
  meetingId: number;

  @IsEnum(EstadoAsistencia)
  estado: EstadoAsistencia;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @IsBoolean()
  justificado?: boolean;
}
