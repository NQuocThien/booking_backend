import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Session } from 'src/modules/contains/session/session.schema';
@Schema({
  timestamps: true,
})
export class Register {
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

  @Prop({ type: Session, default: {} })
  session: Session;

  @Prop()
  cancel: boolean;

  @Prop()
  typeOfService: string;

  @Prop()
  date: Date;

  @Prop()
  state: string;

  @Prop()
  createdAt: Date;
}
export const RegisterSchema = SchemaFactory.createForClass(Register);
