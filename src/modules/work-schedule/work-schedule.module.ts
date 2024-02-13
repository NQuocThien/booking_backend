import { Module } from '@nestjs/common';
import { WorkScheduleResolver } from './work-schedule.resolver';
import { WorkScheduleService } from './work-schedule.service';

@Module({
  providers: [WorkScheduleResolver, WorkScheduleService]
})
export class WorkScheduleModule {}
