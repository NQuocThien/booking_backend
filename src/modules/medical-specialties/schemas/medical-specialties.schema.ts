import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.schema';
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

  @Prop({ type: Object, default: null })
  workSchedule: WorkSchedule;
}
export const MedicalSpecialtiesSchema =
  SchemaFactory.createForClass(MedicalSpecialties);
