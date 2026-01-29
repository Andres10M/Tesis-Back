import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { CreditosEspecialesService } from './creditos-especiales.service';

@Controller('creditos-especiales')
export class CreditosEspecialesController {
  constructor(private service: CreditosEspecialesService) {}

  // 🔹 Crear hoja al abrir la reunión
  @Post('crear-hoja')
  crearHoja(@Body() body) {
    return this.service.crearHojaVacia(
      body.meetingId,
      new Date(body.fecha),
    );
  }

  // 🔹 Actualizar una fila (monto)
  @Put(':id')
  actualizar(@Param('id') id: string, @Body() body) {
    return this.service.actualizarFila(+id, body.monto);
  }

  // 🔹 Obtener créditos por reunión
  @Get('por-reunion/:meetingId')
  findByMeeting(@Param('meetingId') meetingId: string) {
    return this.service.findByMeeting(+meetingId);
  }
}
