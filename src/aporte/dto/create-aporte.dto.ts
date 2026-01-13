import { IsInt } from 'class-validator';

export class CreateAporteDto {
  @IsInt()
  cuentaId: number;

  @IsInt()
  mes: number;

  @IsInt()
  anio: number;
}
