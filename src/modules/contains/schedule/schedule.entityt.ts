import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Session } from '../session/session.entitty';

@ObjectType()
export class Schedule {
  @Field()
  dayOfWeed: string; // thứ trong tuần

  @Field(() => [Session])
  sessions: Session[];
}
