import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class TypePackage {
  @Prop()
  typeName: string;
}
export const TypePackageSchema = SchemaFactory.createForClass(TypePackage);
