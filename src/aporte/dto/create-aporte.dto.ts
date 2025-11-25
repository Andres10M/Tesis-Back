import { IsNumber, IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateAporteDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  date: string;

  @IsInt()
  cuenta_id: number;
}
