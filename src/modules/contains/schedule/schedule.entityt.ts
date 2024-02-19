import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Session } from '../session/session.entitty';
import { EDayOfWeed } from 'src/contain';

@ObjectType()
export class Schedule {
  @Field(() => String)
  dayOfWeed: EDayOfWeed; // thứ trong tuần

  @Field(() => [Session])
  sessions: Session[];
}
