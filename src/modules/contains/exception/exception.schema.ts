import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ _id: false })
export class Exception {
  @Prop(() => [Date])
  dates: Date[];

  @Prop()
  open: Boolean;

  @Prop()
  numbeSlotUpdateVaccination: Number;
}
export const ExceptionSchema = SchemaFactory.createForClass(Exception);
