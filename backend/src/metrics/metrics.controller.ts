import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('metrics')
export class MetricsController {
  constructor(private prisma: PrismaService) {}
  @Get('summary') async summary(@Query('campaignId') campaignId: string) {
    const reports = await this.prisma.report.findMany({ where: { campaignId } });
    let impressions = 0, clicks = 0, spendSek = 0;
    for (const r of reports) { const m: any = r.metrics; impressions += Number(m.impressions||0); clicks += Number(m.clicks||0); spendSek += Number(m.spendSek||0); }
    const ctr = impressions ? clicks / impressions : 0;
    return { impressions, clicks, spendSek, ctr };
  }
  @Get('timeseries') async series(@Query('campaignId') campaignId: string) {
    const reports = await this.prisma.report.findMany({ where: { campaignId }, orderBy: { periodStart: 'asc' } });
    return reports.map(r => ({ t: r.periodStart.toISOString().slice(0,10), impressions: (r.metrics as any)?.impressions ?? 0, clicks: (r.metrics as any)?.clicks ?? 0, spend: (r.metrics as any)?.spendSek ?? 0 }));
  }
}
