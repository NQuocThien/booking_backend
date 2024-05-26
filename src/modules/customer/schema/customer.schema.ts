import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EGender } from 'src/contain';
import {
  Blocks,
  BlocksSchema,
} from 'src/modules/contains/blocks/blocks.schema';
@Schema({
  timestamps: true,
})
export class Customer {
  @Prop()
  userId: string;

  @Prop()
  customerKey: string;

  @Prop({ text: true })
  fullname: String;

  @Prop({ type: String, enum: EGender })
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
  ethnic: String;

  // @Prop({
  //   type: [BlocksSchema],
  //   default: null,
  // })
  // blocks?: Blocks[];
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
