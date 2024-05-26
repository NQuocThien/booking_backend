import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class Blocks {
  @Prop()
  customerId: string;

  @Prop()
  content: string;

  @Prop()
  seen: boolean;
}
export const BlocksSchema = SchemaFactory.createForClass(Blocks);
