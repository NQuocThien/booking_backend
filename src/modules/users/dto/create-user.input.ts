import { ObjectType, Field, Int } from '@nestjs/graphql';
@ObjectType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field()
  active: boolean;
}
