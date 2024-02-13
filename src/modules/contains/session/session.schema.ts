import { Prop, Schema } from '@nestjs/mongoose';
@Schema()
export class Session {
  @Prop()
  startTime: string;

  @Prop()
  endTime: string;
}
