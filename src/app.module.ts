import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SupervisorModule } from './clinical-supervisor/clinical-supervisor.module';
import { HospitalModule } from './hospital/hospital.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { CoursesModule } from './courses/courses.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    UserModule,
    SupervisorModule,
    HospitalModule,
    AuthModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
