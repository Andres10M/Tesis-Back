import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class UpdatePersonDto {
  @IsOptional()
  @Matches(/^\d{10}$/, { message: 'La cédula debe tener exactamente 10 números' })
  nui?: string;

  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, { message: 'Nombre inválido' })
  firstname?: string;

  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, { message: 'Apellido inválido' })
  lastname?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  categoryId?: number;
}
