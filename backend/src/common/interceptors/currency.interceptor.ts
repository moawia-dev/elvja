
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../config/app.config';
@Injectable()
export class CurrencyInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => ({ ...data, currency: AppConfig.currency, vat: 'exkl. moms' })));
  }
}
