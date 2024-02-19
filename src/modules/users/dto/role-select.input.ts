import { Field, InputType } from '@nestjs/graphql';
import { ERole } from 'src/contain';

@InputType()
export class UserSelectInput {
  @Field(() => ERole)
  role: ERole;
}
