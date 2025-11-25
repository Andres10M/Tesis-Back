import { Module } from '@nestjs/common';
import { AmortizationService } from './amortization.service';
import { AmortizationController } from './amortization.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AmortizationController],
  providers: [AmortizationService],
})
export class AmortizationModule {}
