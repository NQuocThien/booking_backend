import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserSlimInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  showName: string;

  @Field(() => String)
  role: string;
}
