import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { Profile } from 'src/modules/profile/entities/profile.entity';
import { LinkImage } from './linkImage.schema';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { MedicalFacilities } from 'src/modules/medical-facilities/schema/medical-facilities.schema';
import { Doctor } from 'src/modules/doctors/schema/docter.schema';

@Schema({
  timestamps: true,
})
export class User {
  // @Prop({ type: mongoose.Schema.Types.ObjectId }) // Sử dụng kiểu dữ liệu của Mongoose
  // id: mongoose.Types.ObjectId;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  active: boolean;

  @Prop({
    type: Object,
    default: null,
  })
  linkImage: LinkImage;

  @Prop(() => [String])
  roles: string[];

  @Prop({ nullable: true })
  customer?: Customer;

  @Prop({ nullable: true })
  medicalFacilities?: MedicalFacilities;

  @Prop({ nullable: true })
  doctor?: Doctor;
}
export const UserSchema = SchemaFactory.createForClass(User);
