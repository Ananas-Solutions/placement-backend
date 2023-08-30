import { Body, Controller, Post } from '@nestjs/common';

import { ExportService } from './export.service';
import { ExportDataDto } from './dto';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post()
  async exportData(@Body() body: ExportDataDto) {
    return this.exportService.exportData(body);
  }
}
