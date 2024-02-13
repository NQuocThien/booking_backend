import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.schema';
import { LinkImage } from 'src/modules/users/schema/linkImage.schema';
@Schema({
  timestamps: true,
})
export class MedicalFacilities {
  @Prop()
  userId: string;

  @Prop()
  medicalFacilityName: string;

  @Prop()
  address: string;

  @Prop()
  numberPhone?: string;

  @Prop({ type: Object, default: null })
  image?: LinkImage;

  @Prop()
  email?: string;

  @Prop({ nullable: true })
  lat?: number;

  @Prop({ nullable: true })
  lng?: number;

  @Prop()
  discription: string;

  @Prop()
  introduce: string;

  @Prop()
  operatingStatus: string; // trạng thái hoạt động

  @Prop()
  legalRepresentation: string; // đại diện pháp luật

  @Prop()
  taxCode: string; // mã số thuế

  @Prop({ type: Object, default: null })
  workSchedule: WorkSchedule;
}
export const MedicalFacilitiesSchema =
  SchemaFactory.createForClass(MedicalFacilities);
