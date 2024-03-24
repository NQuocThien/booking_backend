import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { SessionInput } from 'src/modules/contains/session/session.input';

@InputType()
export class CreateRegisterSpecialtyInput {
  @Field()
  profileId: string;

  @Field()
  specialtyId: String;

  @Field(() => SessionInput)
  session: SessionInput;

  @Field()
  isHealthInsurance: boolean;

  @Field()
  date: Date;
}
