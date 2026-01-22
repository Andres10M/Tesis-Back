import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { CuotasService } from './cuotas.service';
import { TipoCuota } from '@prisma/client';

@Controller('cuotas')
export class CuotasController {
  constructor(private readonly service: CuotasService) {}

  // ======================================
  // ✅ REGISTRO MASIVO DE CUOTAS
  // ======================================
  @Post('masiva')
  guardarMasiva(
    @Body('meetingId') meetingId: number,
    @Body('tipo') tipo: TipoCuota,
    @Body('sociosPagados') sociosPagados: string[],
  ) {
    return this.service.guardarCuotaMasiva(
      meetingId,
      tipo,
      sociosPagados,
    );
  }

  // ======================================
  // 🔍 LISTAR TODAS LAS CUOTAS DE LA REUNIÓN
  // (PAGADAS Y NO PAGADAS)
  // ======================================
  @Get('reunion/:meetingId')
  obtenerPorReunion(
    @Param('meetingId') meetingId: string,
  ) {
    return this.service.obtenerCuotasPorReunion(
      Number(meetingId),
    );
  }

  // ======================================
  // 🔍 LISTAR CUOTAS POR REUNIÓN Y TIPO
  // ======================================
  @Get(':meetingId/:tipo')
  listarPorTipo(
    @Param('meetingId') meetingId: string,
    @Param('tipo') tipo: TipoCuota,
  ) {
    return this.service.listarCuotasPorReunion(
      Number(meetingId),
      tipo,
    );
  }

  // ======================================
  // 📊 RESUMEN DE RECAUDACIÓN
  // ======================================
  @Get('resumen/:meetingId')
  resumen(
    @Param('meetingId') meetingId: string,
  ) {
    return this.service.resumenRecaudacion(
      Number(meetingId),
    );
  }
}
