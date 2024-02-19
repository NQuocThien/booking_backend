import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.schema';
@Schema({
  timestamps: true,
})
export class Vaccination {
  @Prop()
  medicalFactilitiesId: String;

  @Prop()
  vaccineName: String;

  @Prop()
  price: Number;

  @Prop()
  prophylactic: String;

  @Prop()
  countryOfOrigin: String;

  @Prop()
  indication: String;

  @Prop()
  status: String;

  @Prop()
  note: String;

  @Prop({ type: Object, default: null })
  workSchedule: WorkSchedule;
}

export const VaccinationSchema = SchemaFactory.createForClass(Vaccination);
