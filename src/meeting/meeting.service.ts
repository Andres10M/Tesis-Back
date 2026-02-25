import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoAsistencia } from '@prisma/client';
import { CuotasService } from '../cuotas/cuotas.service';
import { CreditosEspecialesService } from '../creditos-especiales/creditos-especiales.service';

@Injectable()
export class MeetingService {
  constructor(
    private prisma: PrismaService,
    private cuotasService: CuotasService,
    private creditosService: CreditosEspecialesService,
  ) {}

  // Método para crear una nueva reunión
  async create(fecha: string) {
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0); // Crear la fecha a partir de la cadena

    const meeting = await this.prisma.meeting.create({
      data: {
        fecha: date,  // Usamos la fecha obtenida
        descripcion: '',  // La descripción está vacía inicialmente
      },
    });

    // CUOTAS AUTOMÁTICAS
    await this.cuotasService.crearCuotasPorReunion(meeting.id); // Creación de cuotas asociadas a la reunión

    // CRÉDITOS ESPECIALES AUTOMÁTICOS
    await this.creditosService.crearHojaVacia(meeting.id, date); // Creación de una hoja vacía de créditos especiales

    // ASISTENCIAS: Recuperamos los socios activos
    const socios = await this.prisma.person.findMany({
      where: { status: true, isDelete: false },
      orderBy: { orderIndex: 'asc' },  // Ordenamos por el índice de orden
    });

    // Preparamos la data para las asistencias
    const attendancesData = socios.map((socio) => ({
      socioId: socio.nui,
      meetingId: meeting.id,
      estado: EstadoAsistencia.ASISTIO, // Asistencia por defecto
      multa: 0,  // Multa inicial (0)
      justificado: false,  // No está justificado
      observacion: null,  // Sin observaciones
    }));

    // Creamos las asistencias en la base de datos
    await this.prisma.attendance.createMany({
      data: attendancesData,
      skipDuplicates: true,  // Evita duplicados en caso de que se repita algún socio
    });

    console.log('📅 REUNIÓN COMPLETA:', meeting.fecha);
    return meeting;
  }

  // Método para obtener todas las reuniones
  async findAll() {
    return this.prisma.meeting.findMany({
      orderBy: { fecha: 'desc' },  // Ordenamos las reuniones por fecha descendente
    });
  }

  // Método para obtener una reunión por su ID
  async findOne(id: number) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('ID inválido');  // Validación del ID
    }

    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      select: { id: true, fecha: true, descripcion: true },  // Solo seleccionamos los campos necesarios
    });

    if (!meeting) throw new NotFoundException('Reunión no encontrada'); // Si no existe la reunión, lanzamos un error
    return meeting;
  }

  // Método para actualizar la descripción de la reunión
  async updateOrdenDia(id: number, orden: string) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('ID inválido');  // Validación del ID
    }

    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');  // Verificamos que la reunión exista

    return this.prisma.meeting.update({
      where: { id },
      data: { descripcion: orden },  // Actualizamos la descripción de la reunión
    });
  }

  // Método para eliminar una reunión por su ID
  async remove(id: number) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('ID inválido');  // Validación del ID
    }

    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException('Reunión no encontrada'); // Verificamos que la reunión exista

    // Eliminamos las asistencias asociadas a la reunión
    await this.prisma.attendance.deleteMany({
      where: { meetingId: id },
    });

    // Eliminamos la reunión
    await this.prisma.meeting.delete({ where: { id } });

    return { message: 'Reunión eliminada correctamente' };
  }
}
