import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateCreditDto {
  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsNotEmpty()
  @IsNumberString()
  interestRate: string;

  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  person_id: string;

  @IsOptional()
  cuenta_id?: number;
}
