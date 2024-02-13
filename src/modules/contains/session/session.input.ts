import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SessionInput {
  @Field()
  startTime: string;

  @Field()
  endTime: string;
}
