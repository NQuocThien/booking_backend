import { Field, InputType } from '@nestjs/graphql';
// import { ERole } from 'src/contain';
import { Role } from 'src/modules/auth/entities/role.enum';

@InputType()
export class UserSelectInput {
  @Field(() => Role)
  role: Role;
}
