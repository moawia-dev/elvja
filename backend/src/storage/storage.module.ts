import { Global, Module } from '@nestjs/common';
import { S3Service } from './s3.service';

@Global() // optional, but handy so you don't have to import everywhere
@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class StorageModule {}
