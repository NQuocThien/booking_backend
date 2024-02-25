import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { EGender, EGenderPackage, EStatusService } from 'src/contain';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class Package {
  @Field(() => ID)
  id: String;

  @Field()
  medicalFactilitiesId: String;

  @Field()
  packageName: String;

  @Field(() => String)
  gender: EGenderPackage;

  @Field()
  price: Number;

  @Field(() => LinkImage)
  image: LinkImage;

  @Field()
  examinationDetails: String;

  @Field(() => WorkSchedule)
  workSchedule: WorkSchedule;
}

registerEnumType(EStatusService, {
  name: 'EStatusService',
});
registerEnumType(EGenderPackage, {
  name: 'EGenderPackage',
});
