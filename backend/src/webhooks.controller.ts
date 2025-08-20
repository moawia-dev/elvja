import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { SignatureService } from './webhooks/signature.service';

@Controller('webhooks')
export class WebhooksVerifiedController {
  constructor(private readonly signatures: SignatureService) {}

  @Post('meta')
  handleMeta(@Body() body: any, @Headers('x-hub-signature') signature?: string) {
    const payload = JSON.stringify(body);
    const ok = this.signatures.verifyMetaSignature(payload, signature);
    return { ok };
  }

  @Post('google')
  google(@Body() body: any, @Req() req: any, @Headers('x-goog-signature') signature?: string) {
    const raw = (req as any).rawBody ?? JSON.stringify(body);
    const ok = this.signatures.verifyGoogleSignature(raw, signature);
    return ok ? { ok: true } : { ok: false, reason: 'invalid_signature' };
  }

  @Post('bidtheatre')
  bid(@Body() body: any, @Req() req: any, @Headers('x-signature') signature?: string) {
    const raw = (req as any).rawBody ?? JSON.stringify(body);
    const ok = this.signatures.verifyBidTheatreSignature(raw, signature);
    return ok ? { ok: true } : { ok: false, reason: 'invalid_signature' };
  }
}
