import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ScheduleInput } from '../schedule/schedule.input';
import { EStatusService } from 'src/contain';

@InputType()
export class WorkScheduleInput {
  @Field(() => [ScheduleInput])
  schedule: ScheduleInput[];

  @Field(() => [Date])
  dayOff: [Date];

  @Field(() => EStatusService)
  status: EStatusService;

  @Field(() => Number)
  numberSlot: number;
}
