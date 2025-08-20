import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SignatureService } from './webhooks/signature.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { EnhancmentModule } from './enhancements.module';           // <-- NOTE: enhancment (your file name)
import { BrandkitModule } from './brandkit/brandkit.module';
import { CreativesModule } from './creatives/creatives.module';
import { MetricsModule } from './metrics/metrics.module';
import { AiModule } from './ai/ai.module';
import { ReportsController } from './modules/reports/reports.controller';
import { ReportsService } from './modules/reports/reports.service';
import { WebhooksVerifiedController } from './webhooks.controller';
import { OauthController } from './auth/oauth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 120 }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    PrismaModule,                // provide Prisma properly

    HealthModule,
    EnhancmentModule,            // <-- use the module you just exported
    BrandkitModule,
    CreativesModule,
    MetricsModule,
    AiModule,
  ],
  controllers: [WebhooksVerifiedController, OauthController, ReportsController],
  providers: [JwtStrategy, AuthService, SignatureService, ReportsService],
})
export class AppModule {}
