import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateCreditDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  interestRate: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  status: string;

  @IsString()
  personId: string;

  @IsOptional()
  cuentaId?: number;
}
