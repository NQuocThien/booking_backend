import { ObjectType, Field, ID } from '@nestjs/graphql';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
import { Doctor } from 'src/modules/doctors/entities/doctor.entity';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class MedicalFacilities {
  @Field((type) => ID)
  id: String;

  @Field()
  userId: string;

  @Field()
  medicalFacilityName: string;

  @Field()
  address: string;

  @Field()
  numberPhone?: string;

  @Field()
  image?: LinkImage;

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

  @Field(() => [Date])
  dayOff: [Date];

  @Field()
  operatingStatus: string; // trạng thái hoạt động

  @Field()
  legalRepresentation: string; // đại diện pháp luật

  @Field()
  taxCode: string; // mã số thuế

  @Field(() => [Doctor], { nullable: true })
  doctors: Doctor[];

  @Field()
  workSchedule: WorkSchedule;
}
