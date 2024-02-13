import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateRegisterDoctorInput {
  @Field()
  customerId: string;

  @Field()
  profileId: string;

  @Field()
  doctorId?: String;

  @Field()
  sessionId: String;

  @Field()
  isHealthInsurance: boolean;

  @Field()
  date: Date;
}
