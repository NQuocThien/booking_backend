import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Doctor } from 'src/modules/doctors/schema/docter.schema';
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
  image?: LinkImage;

  @Prop()
  adress: string;

  @Prop({ nullable: true })
  lat?: number;

  @Prop({ nullable: true })
  lng?: number;

  @Prop({ nullable: true })
  numberPhone?: string;

  @Prop({ nullable: true })
  email?: string;

  @Prop({ nullable: true })
  doctors?: Doctor;
}
export const MedicalFacilitiesSchema =
  SchemaFactory.createForClass(MedicalFacilities);
