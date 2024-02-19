import { Field, InputType } from '@nestjs/graphql';
import { EGender } from 'src/contain';
@InputType()
export class UpdateCustomerInput {
  @Field()
  id: String;

  @Field()
  name: String;

  @Field(() => EGender, { nullable: true })
  gender: EGender;

  @Field({ nullable: true })
  numberPhone: String;

  @Field({ nullable: true })
  email: String;

  @Field({ nullable: true })
  address: String;

  @Field({ nullable: true })
  dateOfBirth: Date;

  @Field({ nullable: true })
  nation: String;
}
