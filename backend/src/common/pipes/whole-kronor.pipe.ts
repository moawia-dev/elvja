
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
@Injectable()
export class WholeKronorPipe implements PipeTransform<number, number> {
  transform(value: any) {
    const n = Number(value);
    if (!Number.isInteger(n)) throw new BadRequestException('Belopp måste anges i hela kronor (SEK).');
    if (n < 0) throw new BadRequestException('Belopp kan inte vara negativt.');
    return n;
  }
}
