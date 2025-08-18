import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreativesService } from './creatives.service';
import { S3Service } from '../storage/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('creatives')
export class CreativesController {
  constructor(private svc: CreativesService, private s3: S3Service) {}
  @Get() list(@Query('campaignId') campaignId: string) { return this.svc.listByCampaign(campaignId); }
  @Post() create(@Body() dto: any) { return this.svc.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({
    destination: 'uploads', filename: (req, file, cb) => cb(null, `creative_${req.params.id}_${Date.now()}${extname(file.originalname)}`)
  })}))
  async image(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) return { ok: false };
    const publicUrl = await this.s3.putLocalOrS3(`uploads/${file.filename}`, file.originalname);
    await this.svc.setImage(id, publicUrl);
    return { ok: true, imageUrl: publicUrl };
  }
}
