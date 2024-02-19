import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.schema';
import { LinkImage } from 'src/modules/users/schema/linkImage.schema';
@Schema({
  timestamps: true,
})
export class Evaluate {
  @Prop()
  userId: string;

  @Prop()
  registerId?: string;

  @Prop()
  comment: String;

  @Prop()
  rating: Number;
}
export const EvaluateSchema = SchemaFactory.createForClass(Evaluate);
