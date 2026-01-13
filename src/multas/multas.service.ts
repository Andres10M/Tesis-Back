import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MultasService {
  constructor(private prisma: PrismaService) {}

  async listarMultas(nui?: string) {
    const rows = await this.prisma.attendance.findMany({
      where: {
        multa: { gt: 0 },
        ...(nui && { socioId: nui }),
      },
      include: {
        person: true,
        meeting: true,
      },
      orderBy: {
        meeting: { fecha: 'desc' },
      },
    });

    return rows.map(r => ({
      id: r.id,
      nui: r.person.nui,
      socio: `${r.person.firstname} ${r.person.lastname}`,
      fecha: r.meeting.fecha,
      estado: r.estado,
      multa: r.multa.toNumber(),
    }));
  }
}
