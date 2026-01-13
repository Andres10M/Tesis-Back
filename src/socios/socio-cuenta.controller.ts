import { Controller, Get, Param } from '@nestjs/common';
import { SocioCuentaService } from './socio-cuenta.service';

@Controller('socios')
export class SocioCuentaController {
  constructor(private readonly service: SocioCuentaService) {}

  @Get(':nui/cuenta')
  obtenerCuenta(@Param('nui') nui: string) {
    return this.service.obtenerResumenCuenta(nui);
  }
}
