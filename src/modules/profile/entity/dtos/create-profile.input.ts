import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateProfileInput {
  @Field()
  customerId: string;

  @Field()
  fullname: string;

  @Field()
  numberPhone: string;

  @Field()
  email: string;

  @Field()
  gender: string;

  @Field()
  address: string;

  @Field()
  dataOfBirth: Date;

  @Field()
  identity: string;

  @Field()
  ethnic: string; // dân tộc

  @Field()
  medicalInsurance: string; // BHYT

  @Field()
  job: string;

  @Field()
  relationship: string;
}
