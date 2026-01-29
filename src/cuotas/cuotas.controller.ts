import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CuotasService } from './cuotas.service';
import { TipoCuota } from '@prisma/client';

@Controller('cuotas')
export class CuotasController {
  constructor(private readonly service: CuotasService) {}

  @Post('masiva')
  guardarMasiva(
    @Body('meetingId') meetingId: number,
    @Body('tipo') tipo: TipoCuota,
    @Body('sociosPagados') sociosPagados: string[],
  ) {
    return this.service.guardarCuotaMasiva(meetingId, tipo, sociosPagados);
  }

  @Get('reunion/:meetingId')
  obtenerPorReunion(@Param('meetingId') meetingId: string) {
    return this.service.obtenerCuotasPorReunion(Number(meetingId));
  }

  @Get(':meetingId/:tipo')
  listarPorTipo(
    @Param('meetingId') meetingId: string,
    @Param('tipo') tipo: TipoCuota,
  ) {
    return this.service.listarCuotasPorReunion(Number(meetingId), tipo);
  }

  @Get('resumen/:meetingId')
  resumen(@Param('meetingId') meetingId: string) {
    return this.service.resumenRecaudacion(Number(meetingId));
  }

  // Endpoints para cuota de ingreso
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
