import { Field, InputType } from '@nestjs/graphql';
import { EStateRegister } from 'src/contain';

@InputType()
export class ConfirmRegisterInput {
  @Field()
  registerId: string;

  @Field({ nullable: true })
  note: string;

  @Field(() => EStateRegister)
  state: EStateRegister;
}
