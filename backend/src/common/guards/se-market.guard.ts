
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppConfig } from '../../config/app.config';
@Injectable()
export class SeMarketGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.market = { country: AppConfig.defaultCountry, currency: AppConfig.currency };
    return true;
  }
}
