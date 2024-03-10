import { InputType, Field, Int } from '@nestjs/graphql';
import { LinkImageInput } from './linkimage.input';
import { Role } from 'src/modules/auth/entities/role.enum';
@InputType()
export class UpdateRolesInput {
  @Field()
  id: string;

  @Field(() => [Role])
  roles?: Role[];
}
