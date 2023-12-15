import { Field, InputType } from '@nestjs/graphql';
import { IRole } from 'src/modules/auth/entities/role.enum';
@InputType()
export class UserSelectInput {
  @Field()
  role: IRole;
}
