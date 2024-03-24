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
  staffName: String;

  @Prop()
  gender: String;

  @Prop()
  numberPhone: String;

  @Prop()
  email: String;

  @Prop(() => [String])
  permissions: string[];

  @Prop(() => [String])
  specialtyId?: [String];
}
export const MedicalStaffSchema = SchemaFactory.createForClass(MedicalStaff);
