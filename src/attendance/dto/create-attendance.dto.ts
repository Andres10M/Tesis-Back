import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  socio_id: string;   // Person.nui

  @IsString()
  @IsNotEmpty()
  estado: string;     // ASISTIO | TARDE | FALTA

  @IsInt()
  reunion_id: number;
}
