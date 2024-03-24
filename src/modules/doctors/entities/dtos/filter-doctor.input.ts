import { InputType, Field } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EGender } from 'src/contain';
@InputType()
export class FilterDoctorInput {
  @Field({ nullable: true })
  doctorName: String;

  @Field(() => EGender, { nullable: true })
  gender: EGender;

  @Field(() => EAcademicTitle, { nullable: true })
  academicTitle: EAcademicTitle;

  @Field(() => EDegree, { nullable: true })
  degree: EDegree;

  @Field({ nullable: true })
  specialistId: String;
}
