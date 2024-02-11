import { InputType, Field } from '@nestjs/graphql';
import { EAcademicTitle, EDegree } from 'src/contain';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class UpdateDoctorInput {
  @Field()
  id: String;

  @Field()
  userId: string;

  @Field()
  medicalFactilitiesId?: string;

  @Field()
  name: String;

  @Field()
  gender: String;

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
