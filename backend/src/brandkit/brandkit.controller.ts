import { Body, Controller, Get, Param, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { BrandkitService } from './brandkit.service';
import { UpsertBrandkitDto } from './dto';
import { S3Service } from '../storage/s3.service';

@UseGuards(JwtAuthGuard)
@Controller('brandkit')
export class BrandkitController {
  constructor(private svc: BrandkitService, private s3: S3Service) {}
  @Get(':accountId') get(@Param('accountId') accountId: string) { return this.svc.get(accountId); }
  @Put(':accountId') upsert(@Param('accountId') accountId: string, @Body() dto: UpsertBrandkitDto) { return this.svc.upsert(accountId, dto); }
  @Put(':accountId/logo')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({
    destination: 'uploads', filename: (req, file, cb) => cb(null, `logo_${accountIdFromReq(req)}_${Date.now()}${extname(file.originalname)}`)
  })}))
  async logo(@Param('accountId') accountId: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) return { ok: false };
    const publicUrl = await this.s3.putLocalOrS3(`uploads/${file.filename}`, file.originalname);
    await this.svc.setLogo(accountId, publicUrl);
    return { ok: true, logoUrl: publicUrl };
  }
}
function accountIdFromReq(req: any): string { return req.params?.accountId || 'unknown'; }
