import { Module } from '@nestjs/common';
import { IndustryPacksService } from './industry-packs.service';
import { IndustryPacksController } from './industry-packs.controller';

@Module({
  controllers: [IndustryPacksController],
  providers: [IndustryPacksService],
  exports: [IndustryPacksService],
})
export class IndustryPacksModule {}
