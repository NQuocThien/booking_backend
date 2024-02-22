import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SessionInput {
  @Field(() => String)
  startTime: String;

  @Field(() => String)
  endTime: String;
}
