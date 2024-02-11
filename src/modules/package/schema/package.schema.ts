import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Package {
  @Prop()
  medicalFactilitiesId: String;

  @Prop()
  packageName: String;

  @Prop()
  gender: String;

  @Prop()
  price: Number;

  @Prop()
  status: String;

  @Prop()
  examinationDetails: String;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
