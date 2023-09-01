import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ExportService } from './export.service';
import { ExportDataDto } from './dto';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post()
  async exportData(@Body() body: ExportDataDto, @Res() response: Response) {
    return this.exportService.exportData(body, response);
  }
}
