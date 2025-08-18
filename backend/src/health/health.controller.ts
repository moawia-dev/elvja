import { Controller, Get } from '@nestjs/common';
@Controller('health')
export class HealthController {
  @Get() get() { return { ok: true, service: 'elvja-backend', ts: new Date().toISOString() }; }
}
