import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CuentasService } from './cuenta.service';

@Controller('cuentas')
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) {}

  // Importar Excel
  @Post('import-excel')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    return this.cuentasService.processExcel(file);
  }

  // Listar todas las cuentas
  @Get()
  async findAll() {
    return this.cuentasService.findAll();
  }

  // Buscar por NUI (cédula exacta)
  @Get(':nui')
  async findByNui(@Param('nui') nui: string) {
    return this.cuentasService.findByNui(nui);
  }
}
