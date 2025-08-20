
import { Body, Controller, Post } from '@nestjs/common';
@Controller('api/ai')
export class AiController {
  @Post('generate-text')
  generateText(@Body() body: { prompt: string }) { return { text: `Förslag: ${body.prompt} – skräddarsytt för svensk B2B-marknad.` }; }
  @Post('generate-image')
  generateImage(@Body() body: { prompt: string }) { return { url: 'https://placehold.co/1080x1080?text=Elvja+AI+Bild' }; }
}
