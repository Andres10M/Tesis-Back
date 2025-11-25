import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumberString } from 'class-validator';

export class CreateCuentaDto {

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumberString()
  balance?: string;

  @IsNotEmpty()
  @IsString()
  person_id: string;

  @IsOptional()
  @IsBoolean()
  estatus?: boolean;
}
