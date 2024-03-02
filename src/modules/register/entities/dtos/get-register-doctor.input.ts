import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { SessionInput } from 'src/modules/contains/session/session.input';

@InputType()
export class GetRegisterDoctorInput {
  @Field()
  doctorId?: String;

  @Field()
  date: Date;
}
