import { Field, InputType } from '@nestjs/graphql';
import { EGender } from 'src/contain';
@InputType()
export class CreateCustomerInput {
  @Field()
  userId: string;

  @Field()
  fullname: string;

  @Field(() => EGender)
  gender: EGender;

  @Field()
  numberPhone: string;

  @Field()
  email: string;

  @Field()
  address: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  ethnic: string;
}
