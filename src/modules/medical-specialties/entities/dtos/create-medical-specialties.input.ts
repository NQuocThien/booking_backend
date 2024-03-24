import { InputType, Field } from '@nestjs/graphql';
import { WorkScheduleInput } from 'src/modules/contains/work-schedule/work-schedule.input';
@InputType()
export class CreateMedicalSpecialtyInput {
  @Field()
  medicalFactilityId: string;

  @Field()
  specialtyName: string;

  @Field()
  price: number;

  @Field()
  discription: string;

  @Field(() => WorkScheduleInput, { nullable: true })
  workSchedule: WorkScheduleInput;
}
