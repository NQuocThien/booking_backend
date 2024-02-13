import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.schema';
import { LinkImage } from 'src/modules/users/schema/linkImage.schema';
@Schema({
  timestamps: true,
})
export class Doctor {
  @Prop()
  userId: string;

  @Prop()
  medicalFactilitiesId?: string;

  @Prop()
  name: String;

  @Prop()
  gender: String;

  @Prop()
  numberPhone: String;

  @Prop()
  email: String;

  @Prop()
  academicTitle?: string;

  @Prop()
  degree: string;

  @Prop()
  specialistId: String;

  @Prop(() => LinkImage)
  avatar?: LinkImage;

  @Prop()
  discription?: string;

  @Prop()
  status: string;

  @Prop({ type: Object, default: null })
  workSchedule: WorkSchedule;
}
export const DoctorSchema = SchemaFactory.createForClass(Doctor);
