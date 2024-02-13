import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Schedule } from '../schedule/schedule.entityt';
import { EStatusService } from 'src/contain';

@ObjectType()
export class WorkSchedule {
  @Field(() => [Schedule])
  schedule: [Schedule];

  @Field(() => [Date])
  dayOff: [Date];

  @Field()
  status: EStatusService;
}
