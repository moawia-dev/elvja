import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandkitService {
  constructor(private prisma: PrismaService) {}
  get(accountId: string) { return this.prisma.brandkit.findUnique({ where: { accountId } }); }
  async upsert(accountId: string, data: any) {
    const exists = await this.prisma.brandkit.findUnique({ where: { accountId } });
    if (exists) return this.prisma.brandkit.update({ where: { accountId }, data });
    return this.prisma.brandkit.create({ data: { accountId, ...data } });
  }
  async setLogo(accountId: string, logoUrl: string) { return this.upsert(accountId, { logoUrl }); }
}
