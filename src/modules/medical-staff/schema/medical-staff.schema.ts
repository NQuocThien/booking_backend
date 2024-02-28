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

  @Prop(() => [String])
  permissions: string[];

  @Prop(() => [String])
  specialtyId?: [String];

  @Prop(() => [String])
  packageId?: [String];

  @Prop(() => [String])
  vaccinationId?: [String];
}
export const MedicalStaffSchema = SchemaFactory.createForClass(MedicalStaff);
