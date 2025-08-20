
import { Controller, Get, Param, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
@Controller('api/reports')
export class ReportsController {
  constructor(private svc: ReportsService) {}
  @Get('summary')
  summary(@Req() req: any) { return this.svc.summary(req.user?.tenantId ?? 'demo-tenant'); }
  @Get('channel/:name')
  channel(@Req() req: any, @Param('name') name: string) { return this.svc.channel(req.user?.tenantId ?? 'demo-tenant', name); }
}
