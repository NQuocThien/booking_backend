import { Field, InputType } from '@nestjs/graphql';
import { EGender } from 'src/contain';
@InputType()
export class UpdateCustomerInput {
  @Field()
  id: String;

  @Field()
  fullname: String;

  @Field(() => EGender)
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: String;

  @Field()
  address: String;

  @Field()
  dateOfBirth: Date;

  @Field()
  ethnic: String;
}
