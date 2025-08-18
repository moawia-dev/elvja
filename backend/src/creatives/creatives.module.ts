import { Module } from '@nestjs/common';
import { CreativesController } from './creatives.controller';
import { CreativesService } from './creatives.service';
@Module({ controllers: [CreativesController], providers: [CreativesService] })
export class CreativesModule {}
