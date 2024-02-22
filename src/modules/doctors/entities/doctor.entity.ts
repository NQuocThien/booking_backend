import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  EAcademicTitle,
  EDayOfWeed,
  EDegree,
  EGender,
  EStatusService,
} from 'src/contain';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
import { MedicalSpecialties } from 'src/modules/medical-specialties/entities/medical-specialties.entity';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class Doctor {
  @Field(() => ID)
  id: String;

  @Field()
  userId: string;

  @Field()
  medicalFactilitiesId?: string;

  @Field()
  name: String;

  @Field(() => String)
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: String;

  @Field(() => String, { nullable: true })
  academicTitle: EAcademicTitle;

  @Field(() => String)
  degree: EDegree;

  @Field()
  specialistId: String;

  @Field(() => LinkImage)
  avatar?: LinkImage;

  @Field()
  discription?: string;

  @Field()
  price?: number;

  @Field(() => WorkSchedule)
  workSchedule: WorkSchedule;

  @Field(() => MedicalSpecialties, { nullable: true })
  specialty: MedicalSpecialties;
}
registerEnumType(EDayOfWeed, {
  name: 'EDayOfWeed',
});

registerEnumType(EDegree, {
  name: 'EDegree',
});
registerEnumType(EAcademicTitle, {
  name: 'EAcademicTitle',
});
registerEnumType(EGender, {
  name: 'EGender',
});
registerEnumType(EStatusService, {
  name: 'EStatusService',
});
