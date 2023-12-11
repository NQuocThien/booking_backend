import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MedicalSpecialties } from 'src/modules/medical-specialties/schemas/medical-specialties.schema';
import { LinkImage } from 'src/modules/users/schema/linkImage.schema';
@Schema({
  timestamps: true,
})
export class Doctor {
  @Prop()
  name: String;

  @Prop()
  email?: String;

  @Prop()
  numberPhone?: String;

  @Prop()
  idSpecialist?: string;

  @Prop()
  userId: string;

  @Prop()
  facilitiesId?: string;

  @Prop(() => LinkImage)
  avatar?: LinkImage;

  @Prop()
  evaluate?: number;

  @Prop()
  degreeId?: string;

  @Prop({ nullable: true })
  medicalSpecialties?: MedicalSpecialties;
}
export const DoctorSchema = SchemaFactory.createForClass(Doctor);
