import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { HealthModule } from './health/health.module';
import { EnhancementsModule } from './enhancements.module';
import { BrandkitModule } from './brandkit/brandkit.module';
import { CreativesModule } from './creatives/creatives.module';
import { MetricsModule } from './metrics/metrics.module';
import { AiModule } from './ai/ai.module';
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
      serveRoot: '/uploads'
    }),
    HealthModule,
    EnhancementsModule,
    BrandkitModule,
    CreativesModule,
    MetricsModule,
    AiModule
  ],
  controllers: [WebhooksVerifiedController, OauthController],
  providers: [PrismaService, JwtStrategy, AuthService]
})
export class AppModule {}
