import { InputType, Field } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EStatusService } from 'src/contain';
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

  @Field(() => LinkImageInput)
  avatar?: LinkImageInput;

  @Field()
  discription?: string;

  @Field()
  status: EStatusService;

  @Field()
  workSchedule: WorkScheduleInput;
}
