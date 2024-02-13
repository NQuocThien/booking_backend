import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class Session {
  @Field()
  startTime: string;

  @Field()
  endTime: string;
}
