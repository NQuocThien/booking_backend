import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from 'src/modules/auth/entities/role.enum';
@ObjectType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [String], { nullable: true })
  roles?: Role[];

  @Field()
  active: boolean;
}
