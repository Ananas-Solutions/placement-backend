import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly socket: WebsocketGateway,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
