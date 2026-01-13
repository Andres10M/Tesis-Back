import { Controller, Get, Query } from '@nestjs/common';
import { MultasService } from './multas.service';

@Controller('multas')
export class MultasController {
  constructor(private readonly service: MultasService) {}

  @Get()
  listar(@Query('nui') nui?: string) {
    return this.service.listarMultas(nui);
  }
}
