import { InputType, Field, Int } from '@nestjs/graphql';
import { LinkImageInput } from './linkimage.input';
@InputType()
export class UpdateUserInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  active: boolean;

  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  avatar: LinkImageInput;
}
