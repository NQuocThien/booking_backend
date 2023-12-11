import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class CreateCustomerInput {
  @Field()
  fullname: string;

  @Field()
  userId: string;
}
