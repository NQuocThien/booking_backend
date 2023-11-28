import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class MedicalSpecialties {
  @Prop()
  name: string;

  @Prop()
  discription: string;
}
export const MedicalSpecialtiesSchema =
  SchemaFactory.createForClass(MedicalSpecialties);
