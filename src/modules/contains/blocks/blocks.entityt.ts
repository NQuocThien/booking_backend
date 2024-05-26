import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Blocks {
  @Field()
  customerId: string;

  @Field()
  content: string;

  @Field()
  seen: boolean;
}
