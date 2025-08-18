import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const account = await prisma.account.upsert({
    where: { id: 'demo-account' },
    update: {},
    create: { id: 'demo-account', name: 'Demo AB' }
  });
  const campaign = await prisma.campaign.upsert({
    where: { id: 'demo-campaign' },
    update: {},
    create: { id: 'demo-campaign', name: 'Lansering Q4', accountId: account.id }
  });
  await prisma.brandkit.upsert({
    where: { accountId: account.id },
    update: { primary: '#6B8355', secondary: '#A3B18A', font: 'Inter' },
    create: { accountId: account.id, primary: '#6B8355', secondary: '#A3B18A', font: 'Inter' }
  });
  const today = new Date();
  for (let i = 14; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const metrics = { impressions: 1000 + (Math.random()*1000|0), clicks: 50 + (Math.random()*50|0), spendSek: 200 + (Math.random()*100|0), ctr: 0.05 };
    await prisma.report.create({ data: { campaignId: campaign.id, periodStart: d, periodEnd: d, metrics } });
  }
  // eslint-disable-next-line no-console
  console.log('Seed done:', { account: account.id, campaign: campaign.id });
}
main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=> prisma.$disconnect())
