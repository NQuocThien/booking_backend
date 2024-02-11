import { Field, registerEnumType, InputType } from '@nestjs/graphql';
import { EStatusService } from 'src/contain';
@InputType()
export class UpdateVaccineInput {
  @Field()
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
  status: EStatusService;

  @Field()
  note: String;
}
registerEnumType(EStatusService, {
  name: 'EStatusService',
});
registerEnumType(EStatusService, {
  name: 'EStatusService',
});
