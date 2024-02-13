import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Session } from '../session/session.entitty';
import { SessionInput } from '../session/session.input';

@InputType()
export class ScheduleInput {
  @Field()
  dayOfWeed: string; // thứ trong tuần

  @Field(() => [SessionInput])
  sessions: [SessionInput];
}
