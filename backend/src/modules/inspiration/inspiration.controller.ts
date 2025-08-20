
import { Controller, Get, Query } from '@nestjs/common';
import { MetaInspirationService } from './meta.service';
@Controller('api/inspiration')
export class InspirationController {
  constructor(private meta: MetaInspirationService) {}
  @Get('meta')
  async metaSearch(@Query('query') query = '', @Query('country') country = 'SE', @Query('limit') limit = '25') {
    const data = await this.meta.search(query, country, parseInt(limit, 10) || 25);
    return { items: data?.data ?? [], country, source: 'meta' };
  }
}
