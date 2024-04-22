import { Field, ID, ObjectType } from '@nestjs/graphql';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
import { MedicalFacilities } from 'src/modules/medical-facilities/entities/mecical-facilies.entity';
import { MedicalStaff } from 'src/modules/medical-staff/entities/medical-staff.entity';

@ObjectType()
export class MedicalSpecialties {
  @Field(() => ID)
  id: string;

  @Field()
  medicalFactilityId: string;

  @Field()
  specialtyName: string;

  @Field()
  price: number;

  @Field()
  discription: string;

  @Field(() => WorkSchedule, { nullable: true })
  workSchedule: WorkSchedule;

  @Field(() => MedicalFacilities, { nullable: true })
  facility: MedicalFacilities;

  @Field(() => Number, { nullable: true })
  registerCount: Number;

  // @Field(() => MedicalStaff, { nullable: true })
  // staff: MedicalStaff;
}
