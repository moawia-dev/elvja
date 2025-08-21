import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(tenantId: string) {
    const row = await this.prisma.reportCache.findFirst({
      where: { tenantId, scope: 'summary' },
      orderBy: { createdAt: 'desc' },
    });

    const payload = (row?.payload as any) ?? {
      totals: { spend: 0, clicks: 0, roasKr: 0 },
    };

    return { ...payload, currency: 'SEK', vat: 'exkl. moms' };
  }

  async channel(tenantId: string, name: string) {
    const row = await this.prisma.reportCache.findFirst({
      where: { tenantId, scope: `channel:${name}` },
      orderBy: { createdAt: 'desc' },
    });

    const payload = (row?.payload as any) ?? {
      totals: { spend: 0, clicks: 0, roasKr: 0 },
    };

    return {
      ...payload,
      channel: name,
      currency: 'SEK',
      vat: 'exkl. moms',
    };
  }
}
