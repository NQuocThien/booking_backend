import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
