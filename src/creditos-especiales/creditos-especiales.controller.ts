import { Controller, Get, Query, Param } from '@nestjs/common';
import { CreditosEspecialesService } from './creditos-especiales.service';

@Controller('creditos-especiales')
export class CreditosEspecialesController {
  constructor(private readonly service: CreditosEspecialesService) {}

  // 🔹 GET /creditos-especiales
  @Get()
  async getAll(
    @Query('nui') nui?: string,
    @Query('anio') anio?: string,
    @Query('mes') mes?: string,
  ) {
    if (nui) {
      return this.service.findByNui(nui);
    }

    if (anio && mes) {
      return this.service.findByPeriodo(+anio, +mes);
    }

    return this.service.findAll();
  }
}
