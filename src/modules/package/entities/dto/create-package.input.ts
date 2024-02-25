import {
  ObjectType,
  Field,
  registerEnumType,
  ID,
  InputType,
} from '@nestjs/graphql';
import { EGender, EGenderPackage, EStatusService } from 'src/contain';
import { WorkScheduleInput } from 'src/modules/contains/work-schedule/work-schedule.input';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class CreatePackageInput {
  @Field()
  medicalFactilitiesId: String;

  @Field()
  packageName: String;

  @Field(() => EGenderPackage)
  gender: EGenderPackage;

  @Field()
  price: Number;

  @Field(() => LinkImageInput)
  image: LinkImageInput;

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
