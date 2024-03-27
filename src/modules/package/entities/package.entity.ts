import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { EGender, EGenderPackage, EStatusService } from 'src/contain';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
import { MedicalFacilities } from 'src/modules/medical-facilities/entities/mecical-facilies.entity';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class Package {
  @Field(() => ID)
  id: string;

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

  @Field(() => MedicalFacilities, { nullable: true })
  facility: MedicalFacilities;
}

registerEnumType(EStatusService, {
  name: 'EStatusService',
});
registerEnumType(EGenderPackage, {
  name: 'EGenderPackage',
});
