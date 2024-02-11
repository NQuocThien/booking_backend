import { InputType, Field } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EGender } from 'src/contain';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class CreateDoctorInput {
  @Field()
  userId: string;

  @Field()
  medicalFactilitiesId?: string;

  @Field()
  name: String;

  @Field()
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: String;

  @Field({ nullable: true })
  academicTitle: EAcademicTitle;

  @Field()
  degree: EDegree;

  @Field()
  specialistId: String;

  @Field(() => [Date])
  dayOff: [Date];

  @Field(() => LinkImageInput)
  avatar?: LinkImageInput;

  @Field()
  discription?: string;
}
