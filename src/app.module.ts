import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AporteModule } from './aporte/aporte.module';
import { AmortizationModule } from './amortization/amortization.module';
import { CategoryModule } from './category/category.module';
import { CreditModule } from './credit/credit.module';
import { CuentaModule } from './cuenta/cuenta.module';
import { FinesModule } from './fines/fines.module';
import { PersonModule } from './person/person.module';
import { TransactionModule } from './transaction/transaction.module';
import { AttendanceModule } from './attendance/attendance.module';
import { MeetingModule } from './meeting/meeting.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AporteModule,
    AmortizationModule,
    CategoryModule,
    CreditModule,
    CuentaModule,
    FinesModule,
    PersonModule,
    TransactionModule,
    AttendanceModule,
    MeetingModule,
  ],
  controllers: [], // Puedes agregar controllers globales si los necesitas
  providers: [],   // Puedes agregar servicios globales si los necesitas
})
export class AppModule {}
