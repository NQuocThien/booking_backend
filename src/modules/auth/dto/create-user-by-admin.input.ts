import { InputType, Field, Int } from '@nestjs/graphql';
@InputType()
export class CreateUserByAdminInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
