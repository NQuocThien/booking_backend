import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { EStatusService } from 'src/contain';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
import { MedicalFacilities } from 'src/modules/medical-facilities/entities/mecical-facilies.entity';
@ObjectType()
export class Vaccination {
  @Field(() => ID)
  id: string;

  @Field()
  medicalFactilitiesId: String;

  @Field()
  vaccineName: String;

  @Field()
  price: Number;

  @Field()
  prophylactic: String;

  @Field()
  countryOfOrigin: String;

  @Field()
  indication: String;

  @Field()
  note: String;

  @Field(() => WorkSchedule)
  workSchedule: WorkSchedule;

  @Field(() => MedicalFacilities, { nullable: true })
  facility: MedicalFacilities;
}

registerEnumType(EStatusService, {
  name: 'EStatusService',
});
