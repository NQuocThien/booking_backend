import { Prop, Schema } from '@nestjs/mongoose';
import { Exception, ExceptionSchema } from '../exception/exception.schema';
@Schema({ _id: false })
export class Session {
  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop({ type: [ExceptionSchema], default: [] })
  exceptions: Exception[];
}
