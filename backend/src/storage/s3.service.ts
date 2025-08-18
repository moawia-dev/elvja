import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class S3Service {
  private s3?: S3Client;
  private bucket?: string;

  constructor() {
    const bucket = process.env.S3_BUCKET;
    if (bucket) {
      this.s3 = new S3Client({ region: process.env.S3_REGION || 'eu-north-1' });
      this.bucket = bucket;
    }
    fs.mkdirSync('uploads', { recursive: true });
  }

  async putLocalOrS3(localPath: string, keyHint: string): Promise<string> {
    if (this.s3 && this.bucket) {
      const key = `uploads/${Date.now()}_${path.basename(keyHint)}`;
      const Body = createReadStream(localPath);
      await this.s3.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body, ContentType: guessContentType(key) }));
      // Return CDN/base URL if configured
      const base = process.env.CDN_BASE || `https://${this.bucket}.s3.${process.env.S3_REGION || 'eu-north-1'}.amazonaws.com`;
      return `${base}/${key}`;
    }
    // fallback: serve from local /uploads via nginx/app
    return `/uploads/${path.basename(localPath)}`;
  }
}

function guessContentType(key: string) {
  if (key.endsWith('.png')) return 'image/png';
  if (key.endsWith('.jpg') || key.endsWith('.jpeg')) return 'image/jpeg';
  if (key.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}
