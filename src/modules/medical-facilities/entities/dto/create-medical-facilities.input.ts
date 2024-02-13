import { Field, InputType } from '@nestjs/graphql';
import { WorkScheduleInput } from 'src/modules/contains/work-schedule/work-schedule.input';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';

@InputType()
export class CreateMedicalFacilityInput {
  @Field()
  userId: string;

  @Field()
  medicalFacilityName: string;

  @Field()
  address: string;

  @Field()
  numberPhone?: string;

  @Field()
  image?: LinkImageInput;

  @Field()
  email?: string;

  @Field({ nullable: true })
  lat?: number;

  @Field({ nullable: true })
  lng?: number;

  @Field()
  discription: string;

  @Field()
  introduce: string;

  @Field()
  operatingStatus: string; // trạng thái hoạt động

  @Field()
  legalRepresentation: string; // đại diện pháp luật

  @Field()
  taxCode: string; // mã số thuế

  @Field()
  workSchedule: WorkScheduleInput;
}
