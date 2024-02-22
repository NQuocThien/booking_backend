import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class Session {
  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;
}
