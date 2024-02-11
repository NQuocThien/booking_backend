import { Field, InputType } from '@nestjs/graphql';
import { EGender } from 'src/contain';
@InputType()
export class CreateCustomerInput {
  @Field()
  userId: string;

  @Field()
  name: String;

  @Field({ nullable: true })
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
