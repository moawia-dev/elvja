import { Module } from '@nestjs/common';
import { BrandkitController } from './brandkit.controller';
import { BrandkitService } from './brandkit.service';
import { S3Service } from '../storage/s3.service';
@Module({ controllers: [BrandkitController], providers: [BrandkitService, S3Service] })
export class BrandkitModule {}
