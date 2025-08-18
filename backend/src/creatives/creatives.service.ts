import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreativesService {
  constructor(private prisma: PrismaService) {}
  listByCampaign(campaignId: string) { return this.prisma.creative.findMany({ where: { campaignId } }); }
  create(dto: any) { return this.prisma.creative.create({ data: dto }); }
  update(id: string, dto: any) { return this.prisma.creative.update({ where: { id }, data: dto }); }
  async setImage(id: string, imageUrl: string) { return this.prisma.creative.update({ where: { id }, data: { imageUrl } }); }
}
