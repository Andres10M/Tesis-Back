import { Module } from '@nestjs/common';

// ===============================
// CORE
// ===============================
import { PrismaModule } from './prisma/prisma.module';

// ===============================
// AUTH / USER
// ===============================
import { UserModule } from './user/user.module';

// ===============================
// SOCIOS / PERSONAS
// ===============================
import { PersonModule } from './person/person.module';
import { CategoryModule } from './category/category.module';
import { SociosModule } from './socios/socios.module'; // ✅ NUEVO (CUENTA INDIVIDUAL)

// ===============================
// CUENTAS / FINANZAS
// ===============================
import { CuentaModule } from './cuenta/cuenta.module';
import { AporteModule } from './aporte/aporte.module';
import { CreditModule } from './credit/credit.module';
import { TransactionModule } from './transaction/transaction.module';
import { AmortizationModule } from './amortization/amortization.module';
import { MultasModule } from './multas/multas.module';

// ===============================
// REUNIONES / ASISTENCIAS
// ===============================
import { AttendanceModule } from './attendance/attendance.module';
import { MeetingModule } from './meeting/meeting.module';
import { PagoMultaModule } from './pago-multa/pago-multa.module';

@Module({
  imports: [
    PrismaModule,

    // AUTH
    UserModule,

    // SOCIOS
    PersonModule,
    CategoryModule,
    SociosModule, // 🔥 AQUÍ SE HABILITA /socios/:nui/cuenta

    // FINANZAS
    CuentaModule,
    AporteModule,
    CreditModule,
    TransactionModule,
    AmortizationModule,
    MultasModule,

    // REUNIONES
    AttendanceModule,
    MeetingModule,
    PagoMultaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
