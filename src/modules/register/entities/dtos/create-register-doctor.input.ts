import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { SessionInput } from 'src/modules/contains/session/session.input';

@InputType()
export class CreateRegisterDoctorInput {
  @Field()
  profileId: string;

  @Field()
  doctorId?: string;

  @Field(() => SessionInput)
  session: SessionInput;

  @Field()
  date: Date;
}
