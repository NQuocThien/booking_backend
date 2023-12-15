import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateRegisterInput {
  @Field()
  profileId: string;

  @Field()
  packegeId: string;

  @Field()
  date: Date;

  @Field()
  state: string;
}
