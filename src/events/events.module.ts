import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueuesModule } from 'src/queues/queues.module';
import { StudentCourse } from 'src/student-course/entity/student-course.entity';
import { UserModule } from 'src/user/user.module';
import { SendEmailService } from 'src/utils/sendEmail';
import { Events } from './entity/events.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Events, StudentCourse]),
    UserModule,
    QueuesModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, SendEmailService],
})
export class EventsModule {}
