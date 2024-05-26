import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Session } from 'src/modules/contains/session/session.schema';
import { LinkImage } from 'src/modules/users/schema/linkImage.schema';
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
  note?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  createdBy: string;

  @Prop({
    type: Array,
    default: [],
  })
  files?: LinkImage[];
}
export const RegisterSchema = SchemaFactory.createForClass(Register);
