import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBlockInput {
  @Field()
  customerId: string;

  @Field()
  content: string;

  @Field()
  seen: boolean;
}
