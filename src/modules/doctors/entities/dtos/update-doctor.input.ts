import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EGender, EStatusService } from 'src/contain';
import { WorkScheduleInput } from 'src/modules/contains/work-schedule/work-schedule.input';
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
  doctorName: String;

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

  @Field(() => LinkImageInput)
  avatar?: LinkImageInput;

  @Field()
  discription?: string;

  @Field()
  price: number;

  @Field(() => WorkScheduleInput)
  workSchedule: WorkScheduleInput;
}
registerEnumType(EStatusService, {
  name: 'EStatusService',
});
