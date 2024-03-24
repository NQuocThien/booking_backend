import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { SessionInput } from 'src/modules/contains/session/session.input';

@InputType()
export class CreateRegisterVaccineInput {
  @Field()
  profileId: string;

  @Field()
  vaccineId?: String;

  @Field(() => SessionInput)
  session: SessionInput;

  @Field()
  isHealthInsurance: boolean;

  @Field()
  date: Date;
}
