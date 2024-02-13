import { Prop, Schema } from '@nestjs/mongoose';
import { Session } from '../session/session.schema';
@Schema()
export class Schedule {
  @Prop()
  dayOfWeed: string;

  @Prop({ type: [Session], default: null })
  sessions: Session[];
}
