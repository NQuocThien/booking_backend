import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EGender, EStatusService } from 'src/contain';
import { WorkScheduleInput } from 'src/modules/contains/work-schedule/work-schedule.input';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class UpdateUserAndDoctorInput {
  @Field()
  userId: string;

  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  medicalFactilitiesId?: string;

  @Field()
  doctorName: string;

  @Field(() => EGender)
  gender: EGender;

  @Field()
  numberPhone: string;

  @Field()
  email: string;

  @Field(() => EAcademicTitle, { nullable: true })
  academicTitle: EAcademicTitle;

  @Field(() => EDegree)
  degree: EDegree;

  @Field()
  specialistId: string;

  @Field(() => LinkImageInput)
  avatar?: LinkImageInput;

  @Field()
  discription?: string;

  @Field()
  price: number;

  @Field(() => WorkScheduleInput)
  workSchedule: WorkScheduleInput;
}
// registerEnumType(EStatusService, {
//   name: 'EStatusService',
// });
