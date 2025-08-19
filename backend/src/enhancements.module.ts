import {
  Module, Injectable, CanActivate, ExecutionContext,
  Controller, Get, Param, Res, UseGuards, NestInterceptor, CallHandler
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Response } from 'express';
import * as crypto from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

// If/when auth is ready, re-enable this and import your AuthModule.
// import { JwtAuthGuard } from '../auth/jwt.guard';

function timingSafeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a); const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

@Injectable()
export class SignatureService {
  verifyMetaSignature(payload: string, signature?: string): boolean {
    const secret = process.env.WEBHOOK_META_APP_SECRET || '';
    if (!secret || !signature) return false;
    const expected = 'sha1=' + crypto.createHmac('sha1', secret).update(payload).digest('hex');
    return timingSafeEqual(expected, signature);
  }
  verifyGoogleSignature(payload: string, signature?: string): boolean {
    const secret = process.env.WEBHOOK_GOOGLE_CLIENT_SECRET || '';
    if (!secret || !signature) return false;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64');
    return timingSafeEqual(expected, signature);
  }
  verifyBidTheatreSignature(payload: string, signature?: string): boolean {
    const secret = process.env.WEBHOOK_BIDTHEATRE_HMAC_SECRET || '';
    if (!secret || !signature) return false;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return timingSafeEqual(expected, signature);
  }
}

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: any = ctx.switchToHttp().getRequest();
    const userId = req?.user?.sub; // when auth is wired
    const accountId = req.params?.accountId || req.query?.accountId || req.body?.accountId;
    const campaignId = req.params?.id || req.params?.campaignId || req.body?.campaignId;
    // TODO: use prisma to verify ownership by userId
    return !!(accountId || campaignId);
  }
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      tap(async () => {
        // placeholder audit - safe no-op
        await this.prisma.$executeRawUnsafe('select 1');
        // console.log(`[AUDIT] ${Date.now() - start}ms`);
      }),
    );
  }
}

@Controller('reports')
// Re-enable JwtAuthGuard later: @UseGuards(JwtAuthGuard, OwnershipGuard)
@UseGuards(OwnershipGuard)
export class ReportsExtraController {
  constructor(private prisma: PrismaService) {}

  @Get(':campaignId/csv')
  async csv(@Param('campaignId') campaignId: string, @Res() res: Response) {
    const rows = await this.prisma.report.findMany({
      where: { campaignId },
      orderBy: { periodStart: 'asc' },
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="report-${campaignId}.csv"`);
    res.write('period_start,period_end,impressions,clicks,ctr,spend_sek\n');
    for (const r of rows) {
      const m: any = r.metrics;
      const line = [
        r.periodStart.toISOString(),
        r.periodEnd.toISOString(),
        m.impressions ?? '',
        m.clicks ?? '',
        m.ctr ?? '',
        m.spendSek ?? '',
      ].join(',');
      res.write(line + '\n');
    }
    res.end();
  }
}

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    SignatureService,
    OwnershipGuard,
  ],
  controllers: [ReportsExtraController],
  exports: [SignatureService], // <-- add this line
})
export class EnhancementsModule {}


