import { IsInt, IsNumber, IsDateString } from 'class-validator';

export class CreateAmortizationDto {
  @IsNumber()
  montoInteres: number;

  @IsDateString()
  fechaCalculo: string;

  @IsInt()
  creditId: number;

  @IsInt()
  cuentaId: number;
}
