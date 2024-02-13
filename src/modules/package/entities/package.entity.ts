import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { EGender, EStatusService } from 'src/contain';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
@ObjectType()
export class Package {
  @Field(() => ID)
  id: String;

  @Field()
  medicalFactilitiesId: String;

  @Field()
  packageName: String;

  @Field(() => EGender)
  gender: EGender;

  @Field()
  price: Number;

  @Field()
  examinationDetails: String;

  @Field(() => WorkSchedule)
  workSchedule: WorkSchedule;
}

registerEnumType(EStatusService, {
  name: 'EStatusService',
});
registerEnumType(EGender, {
  name: 'EGender',
});
