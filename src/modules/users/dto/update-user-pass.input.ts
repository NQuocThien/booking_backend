import { InputType, Field, Int } from '@nestjs/graphql';
import { LinkImageInput } from './linkimage.input';
@InputType()
export class UpdateUserWithPassInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  active: boolean;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => LinkImageInput, { nullable: true })
  avatar: LinkImageInput;

  @Field()
  passwordNew: string;
}
