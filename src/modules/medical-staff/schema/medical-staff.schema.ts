import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class MedicalStaff {
  @Prop()
  userId: String;

  @Prop()
  medicalFacilityId: String;

  @Prop()
  name: String;

  @Prop()
  gender: String;

  @Prop()
  numberPhone: String;

  @Prop()
  email: String;
}
export const MedicalStaffSchema = SchemaFactory.createForClass(MedicalStaff);
