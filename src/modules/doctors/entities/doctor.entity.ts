import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EGender } from 'src/contain';
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

  @Field(() => [Date])
  dayOff: [Date];

  @Field(() => LinkImage)
  avatar?: LinkImage;

  @Field()
  discription?: string;
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
