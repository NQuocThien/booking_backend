import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { SessionInput } from 'src/modules/contains/session/session.input';

@InputType()
export class CreateRegisterPackageInput {
  @Field()
  profileId: string;

  @Field()
  packageId?: string;

  @Field(() => SessionInput)
  session: SessionInput;

  @Field()
  date: Date;
}
