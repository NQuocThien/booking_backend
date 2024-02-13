import {
  ObjectType,
  Field,
  registerEnumType,
  ID,
  InputType,
} from '@nestjs/graphql';
import { EGender, EStatusService } from 'src/contain';
import { WorkScheduleInput } from 'src/modules/contains/work-schedule/work-schedule.input';
@InputType()
export class CreatePackageInput {
  @Field()
  medicalFactilitiesId: String;

  @Field()
  packageName: String;

  @Field(() => EGender)
  gender: EGender;

  @Field()
  price: Number;

  @Field()
  status: EStatusService;

  @Field()
  examinationDetails: String;

  @Field(() => WorkScheduleInput)
  workSchedule: WorkScheduleInput;
}

registerEnumType(EStatusService, {
  name: 'EStatusService',
});
registerEnumType(EGender, {
  name: 'EGender',
});
