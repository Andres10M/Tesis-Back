import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { PagoMultaService } from './pago-multa.service';

@Controller('multas')
export class PagoMultaController {
  constructor(private service: PagoMultaService) {}

  @Post('pagar')
  pagar(@Body() body) {
    return this.service.pagar(body);
  }

  @Get('historial')
  historial(@Query('nui') nui?: string) {
    return this.service.historial(nui);
  }
}
