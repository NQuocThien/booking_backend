import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { RegisterState } from '../register.entity';

@InputType()
export class UpdateRegisterInput {
  @Field()
  id: String;

  @Field()
  state: RegisterState;
}
