import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  nui: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  is_delete?: boolean;

  @IsOptional()
  @IsNumber()
  uep_id?: number;
}
