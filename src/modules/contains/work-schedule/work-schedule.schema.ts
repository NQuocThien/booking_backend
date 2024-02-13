import { Prop, Schema } from '@nestjs/mongoose';
import { Schedule } from '../schedule/schedule.schema';
@Schema()
export class WorkSchedule {
  @Prop({ type: [Schedule], require: true })
  schedule: [Schedule];

  @Prop(() => [Date])
  dayOff: [Date];

  @Prop()
  status: string;
}
