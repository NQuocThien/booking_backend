import { Field, ID, ObjectType } from '@nestjs/graphql';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';

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
}
