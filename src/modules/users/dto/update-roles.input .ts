import { InputType, Field, Int } from '@nestjs/graphql';
import { LinkImageInput } from './linkimage.input';
@InputType()
export class UpdateRolesInput {
  @Field()
  id: string;

  @Field(() => [String])
  roles?: string[];
}
