import { Module } from '@nestjs/common';

import { EmailService } from 'helper/send-email.service';
import { QueuesModule } from 'queues/queues.module';
import { UserModule } from 'user/user.module';

import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [UserModule, QueuesModule],
  controllers: [EventController],
  providers: [EventService, EmailService],
})
export class EventModule {}
