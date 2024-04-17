import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class UserSlimEntity {
  @Field(() => String)
  username: string;

  @Field(() => String)
  showName: string;

  @Field(() => String)
  role: string;
}
