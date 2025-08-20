// src/enhancment.module.ts
import { Module, Controller, Get, Param, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Controller('reports')
export class ReportsExtraController {
  constructor(private prisma: PrismaService) {}

  @Get('summary')
  async summary() {
    const reports = await this.prisma.report.findMany();
    let spend = 0, clicks = 0;
    for (const r of reports) {
      const m: any = r.metrics ?? {};
      spend  += Number(m.spendSek ?? 0);
      clicks += Number(m.clicks   ?? 0);
    }
    const roasKr = spend > 0 ? 1.0 : 0; // placeholder
    return { totals: { spend, clicks, roasKr } };
  }

  @Get('channel')
  async channel(@Query('key') key: string) {
    return { key, spend: 0, clicks: 0, notes: 'stubbed' };
  }

  @Get(':campaignId/csv')
  async csv(@Param('campaignId') campaignId: string, @Res() res: Response) {
    const rows = await this.prisma.report.findMany({
      where: { campaignId },
      orderBy: { periodStart: 'asc' },
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="report-${campaignId}.csv"`);
    res.write('period_start,period_end,impressions,clicks,ctr,spend_sek\n');
    for (const r of rows) {
      const m: any = r.metrics ?? {};
      const line = [
        r.periodStart.toISOString(),
        r.periodEnd.toISOString(),
        m.impressions ?? '',
        m.clicks ?? '',
        m.ctr ?? '',
        m.spendSek ?? '',
      ].join(',');
      res.write(line + '\n');
    }
    res.end();
  }
}

@Module({
  imports: [PrismaModule],                 // so PrismaService can be injected
  controllers: [ReportsExtraController],
})
export class EnhancmentModule {}
