import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LinkImage } from 'src/modules/users/schema/linkImage.schema';
@Schema({
  timestamps: true,
})
export class Customer {
  @Prop()
  fullname: string;
  @Prop()
  userId: string;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
