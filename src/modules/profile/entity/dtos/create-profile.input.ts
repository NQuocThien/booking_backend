import { InputType, Field } from '@nestjs/graphql';
import { EGender } from 'src/contain';
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

  @Field(() => EGender)
  gender: EGender;

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
