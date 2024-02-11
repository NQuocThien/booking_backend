import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { EStatusService } from 'src/contain';
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
  status: EStatusService;

  @Field()
  note: String;
}

registerEnumType(EStatusService, {
  name: 'EStatusService',
});
