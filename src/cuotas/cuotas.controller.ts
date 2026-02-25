import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CuotasService } from './cuotas.service';

@Controller('cuotas')
export class CuotasController {
  constructor(private readonly service: CuotasService) {}

  // Guardar cuotas masivas (nuevo formato real)
  @Post('masiva')
  guardarMasiva(
    @Body() body: {
      meetingId: number;
      pagos2: Record<string, boolean>;
      pagos20: Record<string, boolean>;
    },
  ) {
    return this.service.guardarCuotaMasiva(body);
  }

  @Get('reunion/:meetingId')
  obtenerPorReunion(@Param('meetingId') meetingId: string) {
    return this.service.obtenerCuotasPorReunion(Number(meetingId));
  }

  @Get('resumen/:meetingId')
  resumen(@Param('meetingId') meetingId: string) {
    return this.service.resumenRecaudacion(Number(meetingId));
  }

  // Totales reales (los que no se bajan nunca)
  @Get('totales/:meetingId')
  getTotales(@Param('meetingId') meetingId: string) {
    return this.service.obtenerTotalesReales(Number(meetingId));
  }

  // Cuota de ingreso
  @Get('ingreso/pendientes')
  pendientesIngreso() {
    return this.service.listarSociosPendientesIngreso();
  }

  @Post('ingreso/pagar')
  pagarIngreso(
    @Body('nui') nui: string,
    @Body('monto') monto: number,
  ) {
    return this.service.pagarCuotaIngreso(nui, monto);
  }
}
