import { Field, InputType } from '@nestjs/graphql';
import { EStateRegister } from 'src/contain';

@InputType()
export class UpdateRegisterInput {
  @Field()
  id: String;
  @Field(() => EStateRegister)
  state: EStateRegister;
}
