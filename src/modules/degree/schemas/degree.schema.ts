import { ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Degree {
  @Prop()
  name: string;

  @Prop()
  abbreviations: string;
}
export const DegreeSchema = SchemaFactory.createForClass(Degree);
