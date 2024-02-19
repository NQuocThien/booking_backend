import { Field, registerEnumType, InputType } from '@nestjs/graphql';
import { EStatusService } from 'src/contain';
import { WorkScheduleInput } from 'src/modules/contains/work-schedule/work-schedule.input';
@InputType()
export class CreateVaccineInput {
  @Field()
  medicalFactilitiesId: String;

  @Field()
  vaccineName: String;

  @Field()
  price: Number;

  @Field()
  prophylactic: String;

  @Field()
  countryOfOrigin: String;

  @Field()
  indication: String;

  @Field()
  note: String;

  @Field(() => WorkScheduleInput)
  workSchedule: WorkScheduleInput;
}
registerEnumType(EStatusService, {
  name: 'EStatusService',
});
