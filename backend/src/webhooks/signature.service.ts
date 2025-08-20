import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

function timingSafeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

@Injectable()
export class SignatureService {
  verifyMetaSignature(payload: string, signature?: string) {
    const secret = process.env.WEBHOOK_META_APP_SECRET || '';
    if (!secret || !signature) return false;
    const expected = 'sha1=' + crypto.createHmac('sha1', secret).update(payload).digest('hex');
    return timingSafeEqual(expected, signature);
  }

  verifyGoogleSignature(payload: string, signature?: string) {
    const secret = process.env.WEBHOOK_GOOGLE_CLIENT_SECRET || '';
    if (!secret || !signature) return false;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64');
    return timingSafeEqual(expected, signature);
  }

  verifyBidTheatreSignature(payload: string, signature?: string) {
    const secret = process.env.WEBHOOK_BIDTHEATRE_HMAC_SECRET || '';
    if (!secret || !signature) return false;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return timingSafeEqual(expected, signature);
  }
}
