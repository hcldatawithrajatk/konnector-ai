import { Module } from '@nestjs/common';
import { AiEmployeeService } from './ai-employee.service';
import { AiEmployeeController } from './ai-employee.controller';

@Module({
  controllers: [AiEmployeeController],
  providers: [AiEmployeeService],
  exports: [AiEmployeeService],
})
export class AiEmployeeModule {}
