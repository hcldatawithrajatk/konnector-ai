import { Module } from '@nestjs/common';
import { HumanHandoffService } from './human-handoff.service';
import { HumanHandoffController } from './human-handoff.controller';

@Module({
  controllers: [HumanHandoffController],
  providers: [HumanHandoffService],
  exports: [HumanHandoffService],
})
export class HumanHandoffModule {}
