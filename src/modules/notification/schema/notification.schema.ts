import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Notification {
  @Prop()
  userId: string;

  @Prop()
  content?: string;

  @Prop()
  detailPath: String;

  @Prop()
  status: String;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
