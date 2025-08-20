// backend/src/modules/etl/etl.metrics.worker.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function runEtlForTenant(tenantId: string) {
  // NOTE: Your schema has no tenant column; remove tenantId or join via account/campaign if you add it later.
  const rows = await prisma.report.findMany({
    select: { campaignId: true, metrics: true },
  });

  // aggregate per campaign from JSON metrics
  const byCampaign = new Map<string, { spend: number; clicks: number; revenue: number }>();
  for (const r of rows) {
    const m = (r.metrics as any) ?? {};
    const cur = byCampaign.get(r.campaignId) ?? { spend: 0, clicks: 0, revenue: 0 };
    cur.spend += Number(m.spendSek ?? 0);
    cur.clicks += Number(m.clicks ?? 0);
    cur.revenue += Number(m.revenue ?? 0);
    byCampaign.set(r.campaignId, cur);
  }

  const totals = Array.from(byCampaign.values()).reduce(
    (acc, v) => {
      acc.spend += v.spend;
      acc.clicks += v.clicks;
      acc.roasKr += v.revenue; // keeping your original naming
      return acc;
    },
    { spend: 0, clicks: 0, roasKr: 0 }
  );

  console.log('ETL totals', { tenantId, totals });
}

if (require.main === module) {
  runEtlForTenant(process.argv[2] ?? 'demo-tenant')
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
