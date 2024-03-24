import { Field, InputType } from '@nestjs/graphql';
import { EGender } from 'src/contain';
@InputType()
export class CreateCustomerInput {
  @Field()
  userId: string;

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
