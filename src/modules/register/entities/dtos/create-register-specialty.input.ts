import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateRegisterSpecialtyInput {
  @Field()
  customerId: string;

  @Field()
  profileId: string;

  @Field()
  specialtyId: String;

  @Field()
  sessionId: String;

  @Field()
  isHealthInsurance: boolean;

  @Field()
  date: Date;
}
