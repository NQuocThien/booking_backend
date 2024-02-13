import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.schema';
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

  @Prop({ type: Object, default: null })
  workSchedule: WorkSchedule;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
