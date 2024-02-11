import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Profile {
  @Prop()
  customerId: string;

  @Prop()
  fullname: string;

  @Prop()
  gender: string;

  @Prop()
  numberPhone: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop()
  dataOfBirth: Date;

  @Prop()
  identity: string;

  @Prop()
  ethnic: string; // dân tộc

  @Prop()
  medicalInsurance: string; // BHYT

  @Prop()
  job: string;

  @Prop()
  relationship: string; // mqh
}
export const ProfileSchema = SchemaFactory.createForClass(Profile);
