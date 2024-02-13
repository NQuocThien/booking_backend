import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Register {
  @Prop()
  customerId: string;

  @Prop()
  profileId: string;

  @Prop()
  specialtyId?: String;

  @Prop()
  doctorId?: String;

  @Prop()
  packageId?: String;

  @Prop()
  vaccineId?: String;

  @Prop()
  sessionId: String;

  @Prop()
  isHealthInsurance: boolean;

  @Prop()
  typeOfService: string;

  @Prop()
  date: Date;

  @Prop()
  state: string;
}
export const RegisterSchema = SchemaFactory.createForClass(Register);
