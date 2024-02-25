import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.schema';
import { LinkImage } from 'src/modules/users/schema/linkImage.schema';
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

  @Prop(() => LinkImage)
  image: LinkImage;

  @Prop()
  price: Number;

  @Prop()
  examinationDetails: String;

  @Prop({ type: Object, default: null })
  workSchedule: WorkSchedule;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
