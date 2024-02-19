import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { EStatusService } from 'src/contain';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
@ObjectType()
export class Vaccination {
  @Field(() => ID)
  id: String;

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
}

registerEnumType(EStatusService, {
  name: 'EStatusService',
});
