import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EGender, EStatusService } from 'src/contain';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
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

  @Field(() => EGender)
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: String;

  @Field(() => EAcademicTitle, { nullable: true })
  academicTitle: EAcademicTitle;

  @Field(() => EDegree)
  degree: EDegree;

  @Field()
  specialistId: String;

  @Field(() => LinkImage)
  avatar?: LinkImage;

  @Field()
  discription?: string;

  @Field()
  status: EStatusService;

  @Field(() => WorkSchedule)
  workSchedule: WorkSchedule;
}

registerEnumType(EDegree, {
  name: 'EDegree',
});
registerEnumType(EAcademicTitle, {
  name: 'EAcademicTitle',
});
registerEnumType(EGender, {
  name: 'EGender',
});
