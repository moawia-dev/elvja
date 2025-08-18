import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { AdGenDto, AudienceDto, BudgetDto } from './dto';
@Controller('ai')
export class AiController {
  constructor(private ai: AiService) {}
  @Post('adgen') adgen(@Body() dto: AdGenDto) {
    if (!dto?.useAI) return { ok:false, reason:'ai_opt_out' };
    const copy = this.ai.generateAdCopy(dto.industry, dto.goal, dto.tone);
    const banner = this.ai.generateBannerSvg(dto.brandPrimary, dto.brandSecondary, dto.bannerText || 'ELVJA');
    return { ok:true, copy, banner };
  }
  @Post('audience') async audience(@Body() dto: AudienceDto) {
    if (!dto?.useAI) return { ok:false, reason:'ai_opt_out' };
    if (dto.url) return this.ai.suggestAudienceFromUrl(dto.url);
    const text = (dto.text||'').toLowerCase(); const words = text.match(/[a-zåäö0-9\-]{3,}/g) || [];
    const freq: Record<string, number> = {}; for (const w of words) freq[w]=(freq[w]||0)+1;
    const top = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([k])=>k);
    return { keywords: top, segments: top.map(k => ({ keyword: k, interest: 'int:'+k, affinity: 0.5 })) };
  }
  @Post('budget') budget(@Body() dto: BudgetDto) {
    if (!dto?.useAI) return { ok:false, reason:'ai_opt_out' };
    return this.ai.optimizeBudget(dto.channels||[], dto.target||'roas');
  }
}
