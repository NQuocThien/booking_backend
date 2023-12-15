import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Register {
  @Prop()
  profileId: string;

  @Prop()
  packegeId: string;

  @Prop()
  date: Date;

  @Prop()
  state: string;
}
export const RegisterSchema = SchemaFactory.createForClass(Register);
