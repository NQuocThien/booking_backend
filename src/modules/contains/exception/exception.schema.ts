import { Prop, Schema } from '@nestjs/mongoose';
import { Session } from '../session/session.schema';
import { EDayOfWeed } from 'src/contain';
@Schema()
export class Exception {
  @Prop({ type: EDayOfWeed })
  dayOfWeek: EDayOfWeed;

  @Prop({ type: [Session], default: null })
  sessions: Session[];
}
