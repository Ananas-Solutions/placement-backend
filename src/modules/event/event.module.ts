import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventEntity } from 'entities/events.entity';
import { StudentCourseEntity } from 'entities/student-course.entity';
import { EmailService } from 'helper/send-email.service';
import { QueuesModule } from 'queues/queues.module';
import { UserModule } from 'user/user.module';

import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, StudentCourseEntity]),
    UserModule,
    QueuesModule,
  ],
  controllers: [EventController],
  providers: [EventService, EmailService],
})
export class EventModule {}
