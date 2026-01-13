import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SocioCuentaController } from './socio-cuenta.controller';
import { SocioCuentaService } from './socio-cuenta.service';

@Module({
  imports: [PrismaModule],
  controllers: [SocioCuentaController],
  providers: [SocioCuentaService],
})
export class SociosModule {}
