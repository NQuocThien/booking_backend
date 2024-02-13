import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateRegisterVaccineInput {
  @Field()
  customerId: string;

  @Field()
  profileId: string;

  @Field()
  vaccineId?: String;

  @Field()
  sessionId: String;

  @Field()
  isHealthInsurance: boolean;

  @Field()
  date: Date;
}
