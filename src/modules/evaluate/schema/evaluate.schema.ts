import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Evaluate {
  @Prop()
  userId: string;

  @Prop()
  customerName: string;

  @Prop()
  registerId?: string;

  @Prop()
  comment: String;

  @Prop()
  rating: Number;

  @Prop()
  typeOfService: string;

  @Prop()
  specialtyId?: String;

  @Prop()
  doctorId?: String;

  @Prop()
  packageId?: String;

  @Prop()
  vaccineId?: String;

  @Prop()
  createdAt?: Number;

  @Prop()
  updatedAt?: Number;
}
export const EvaluateSchema = SchemaFactory.createForClass(Evaluate);
