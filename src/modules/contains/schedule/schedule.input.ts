import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { SessionInput } from '../session/session.input';
import { EDayOfWeed } from 'src/contain';

@InputType()
export class ScheduleInput {
  @Field(() => EDayOfWeed)
  dayOfWeek: EDayOfWeed; // thứ trong tuần (thứ 2)

  @Field(() => [SessionInput])
  sessions: [SessionInput]; //
}
registerEnumType(EDayOfWeed, {
  name: 'EDayOfWeed',
});
