import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Schedule } from '../schedule/schedule.entityt';
import { EStatusService } from 'src/contain';

registerEnumType(EStatusService, {
  name: 'EStatusService',
});

@ObjectType()
export class WorkSchedule {
  @Field(() => [Schedule])
  schedule: [Schedule];

  @Field(() => [Date])
  dayOff: [Date];

  @Field(() => String)
  status: EStatusService;

  @Field(() => Number)
  numberSlot: number;
}
