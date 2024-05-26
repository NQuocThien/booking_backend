import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBlockInput {
  @Field()
  customerId: string;

  @Field()
  content: string;

  @Field()
  seen: boolean;
}
