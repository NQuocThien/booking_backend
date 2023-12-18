import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LinkImage } from 'src/modules/users/schema/linkImage.schema';
@Schema({
  timestamps: true,
})
export class CarePackage {
  @Prop()
  medicalFacilitiesId: string;

  @Prop()
  typePackageId: string;

  @Prop()
  name: string;

  @Prop()
  discription: string;

  @Prop(() => LinkImage)
  image: LinkImage;

  @Prop()
  price: number;
}
export const CarePackageSchema = SchemaFactory.createForClass(CarePackage);
