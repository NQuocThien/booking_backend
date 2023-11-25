import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LinkImage } from 'src/modules/users/schema/linkImage.schema';
@Schema({
  timestamps: true,
})
export class MedicalFacilities {
  @Prop()
  userId: string;

  @Prop()
  companyName: string;

  @Prop()
  discription: string;

  @Prop({ type: Object, default: null })
  image: LinkImage;

  @Prop()
  adress: string;
}
export const MedicalFacilitiesSchema =
  SchemaFactory.createForClass(MedicalFacilities);
