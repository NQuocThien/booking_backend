import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EGender } from 'src/contain';
@Schema({
  timestamps: true,
})
export class Customer {
  @Prop()
  userId: string;

  @Prop()
  name: String;

  @Prop()
  gender: EGender;

  @Prop()
  numberPhone: String;

  @Prop()
  email: String;

  @Prop()
  address: String;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  nation: String;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
