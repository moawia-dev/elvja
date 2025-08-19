import { Module } from '@nestjs/common';
import { CreativesController } from './creatives.controller';
import { CreativesService } from './creatives.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module'; // <-- add this

@Module({
  imports: [PrismaModule, StorageModule], // <-- add StorageModule
  controllers: [CreativesController],
  providers: [CreativesService],
})
export class CreativesModule {}
