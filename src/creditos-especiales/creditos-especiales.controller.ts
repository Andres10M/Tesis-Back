import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException } from '@nestjs/common';
import { CreditosEspecialesService } from './creditos-especiales.service';

@Controller('creditos-especiales')
export class CreditosEspecialesController {
  constructor(private service: CreditosEspecialesService) {}

  @Post('crear-hoja')
  async crearHoja(@Body() body: { meetingId: number; fecha: string }) {
    const { meetingId, fecha } = body;
    if (!meetingId || !fecha) {
      throw new BadRequestException('Faltan parámetros meetingId o fecha');
    }
    return this.service.crearHojaVacia(meetingId, new Date(fecha));
  }

  @Put(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() body: { monto: number; pagado?: boolean },
  ) {
    const { monto, pagado } = body;
    if (monto === undefined || monto === null) {
      throw new BadRequestException('Monto inválido');
    }
    return this.service.actualizarFila(+id, monto, pagado);
  }

  @Get('por-reunion/:meetingId')
  async findByMeeting(@Param('meetingId') meetingId: string) {
    return this.service.findByMeeting(+meetingId);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get('acumulado-anterior/:meetingId')
  async getAcumuladoAnterior(@Param('meetingId') meetingId: string) {
    return this.service.getAcumuladoAnterior(+meetingId);
  }

  @Post('guardar-hoja')
  async guardarHoja(@Body() body: { meetingId: number; fecha: string; filas: { socioId: string; monto: number; pagado?: boolean }[] }) {
    const { meetingId, fecha, filas } = body;
    if (!meetingId || !fecha || !filas) {
      throw new BadRequestException('Faltan parámetros para guardar hoja');
    }
    return this.service.guardarHoja(meetingId, new Date(fecha), filas);
  }

  @Delete('eliminar-por-meeting/:meetingId')
  async eliminarPorMeeting(@Param('meetingId') meetingId: string) {
    return this.service.eliminarPorMeeting(+meetingId);
  }

  @Get('total-creditos')
  async getTotalCreditos() {
    return this.service.getTotalCreditos();
  }

  @Put('actualizar-masivo')
  async actualizarMasivo(
    @Body() body: { filas: { id: number; monto: number; pagado?: boolean }[] },
  ) {
    const { filas } = body;
    if (!filas || !Array.isArray(filas)) {
      throw new BadRequestException('Filas inválidas');
    }
    return this.service.actualizarMasivo(filas);
  }

  @Get('creditos-por-socio/:socioId')
  async getCreditosPorSocio(@Param('socioId') socioId: string) {
    return this.service.getCreditosPorSocio(socioId);
  }

  @Get('mes-anterior/:meetingId')
  async getMesAnterior(@Param('meetingId') meetingId: string) {
    return this.service.getMesAnterior(+meetingId);
  }
}
