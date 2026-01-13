import { EstadoAsistencia } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAttendanceDto {
  @IsEnum(EstadoAsistencia)
  estado: EstadoAsistencia; // 🔥 YA NO ES OPCIONAL

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @IsBoolean()
  justificado?: boolean;
}
