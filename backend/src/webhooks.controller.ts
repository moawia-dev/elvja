import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { SignatureService } from './enhancements.module';

@Controller('webhooks')
export class WebhooksVerifiedController {
  constructor(private sig: SignatureService) {}
  @Post('meta')
  meta(@Body() body: any, @Req() req: any, @Headers('x-hub-signature') signature?: string) {
    const raw = (req as any).rawBody || JSON.stringify(body);
    if (!this.sig.verifyMetaSignature(raw, signature)) return { ok: false, reason: 'invalid_signature' };
    return { ok: true };
  }
  @Post('google')
  google(@Body() body: any, @Req() req: any, @Headers('x-goog-signature') signature?: string) {
    const raw = (req as any).rawBody || JSON.stringify(body);
    if (!this.sig.verifyGoogleSignature(raw, signature)) return { ok: false, reason: 'invalid_signature' };
    return { ok: true };
  }
  @Post('bidtheatre')
  bid(@Body() body: any, @Req() req: any, @Headers('x-signature') signature?: string) {
    const raw = (req as any).rawBody || JSON.stringify(body);
    if (!this.sig.verifyBidTheatreSignature(raw, signature)) return { ok: false, reason: 'invalid_signature' };
    return { ok: true };
  }
}
