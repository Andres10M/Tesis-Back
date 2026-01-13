import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCuentaDto {
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsString()
  personId: string;
}
