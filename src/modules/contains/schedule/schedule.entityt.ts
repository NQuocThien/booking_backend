import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Session } from '../session/session.entitty';
import { EDayOfWeed } from 'src/contain';

@ObjectType()
export class Schedule {
  // 1 ngày
  @Field(() => String)
  dayOfWeek: EDayOfWeed; // thứ trong tuần thứ 2 -> 10  7 8  9 10

  @Field(() => [Session])
  sessions: Session[];
}
