import { IsString, IsOptional, IsBoolean, IsNumberString, Length, Matches } from 'class-validator';

export class CreatePersonDto {
  @IsNumberString({}, { message: 'La cédula solo debe contener números' })
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 números' })
  nui: string;

  @IsString()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, { message: 'Nombre inválido' })
  firstname: string;

  @IsString()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, { message: 'Apellido inválido' })
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
  isDelete?: boolean;

  @IsOptional()
  categoryId?: number;
}
