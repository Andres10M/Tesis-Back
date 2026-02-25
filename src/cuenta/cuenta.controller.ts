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

  // ===============================
  // IMPORTAR EXCEL
  // ===============================
  @Post('import-excel')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    return this.cuentasService.processExcel(file);
  }

  // ===============================
  // LISTAR TODAS LAS CUENTAS
  // ===============================
  @Get()
  async findAll() {
    return this.cuentasService.findAll();
  }

  // ===============================
  // BUSCAR CUENTA POR CÉDULA
  // ===============================
  @Get(':nui')
  async findByNui(@Param('nui') nui: string) {
    return this.cuentasService.findByNui(nui);
  }

  // ===============================
  // 🔥 RESUMEN COMPLETO DEL SOCIO
  // ===============================
  @Get('resumen/:nui')
  async resumenSocio(@Param('nui') nui: string) {
    return this.cuentasService.resumenSocio(nui);
  }
}
