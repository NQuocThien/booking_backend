import { Field, InputType } from '@nestjs/graphql';
import { EStateRegister } from 'src/contain';

@InputType()
export class ConfirmRegisterInput {
  @Field()
  registerId: String;

  @Field(() => EStateRegister)
  state: EStateRegister;
}
