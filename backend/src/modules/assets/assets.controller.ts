
import { Controller, Post, Body } from '@nestjs/common';
@Controller('api/assets')
export class AssetsController {
  @Post('presign')
  async presign(@Body() body: { filename: string; mime: string }) {
    const url = `https://s3.${process.env.S3_REGION}.amazonaws.com/${process.env.S3_BUCKET}/${encodeURIComponent(body.filename)}`;
    return { url, method: 'PUT', headers: { 'Content-Type': body.mime }, expiresIn: 600 };
  }
}
