import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateRegisterPackageInput {
  @Field()
  customerId: string;

  @Field()
  profileId: string;

  @Field()
  packageId?: String;

  @Field()
  sessionId: String;

  @Field()
  isHealthInsurance: boolean;

  @Field()
  date: Date;
}
