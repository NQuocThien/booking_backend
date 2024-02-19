import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Session } from '../session/session.entitty';
import { SessionInput } from '../session/session.input';
import { EDayOfWeed } from 'src/contain';

@InputType()
export class ScheduleInput {
  @Field(() => EDayOfWeed)
  dayOfWeed: EDayOfWeed; // thứ trong tuần

  @Field(() => [SessionInput])
  sessions: [SessionInput];
}
