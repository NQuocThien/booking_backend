import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class MedicalSpecialties {
  @Prop()
  medicalFactilityId: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  discription: string;
}
export const MedicalSpecialtiesSchema =
  SchemaFactory.createForClass(MedicalSpecialties);
