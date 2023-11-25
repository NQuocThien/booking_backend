import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Profile {
  @Prop()
  userId: string;

  @Prop()
  fullname: string;

  @Prop()
  email: string;
}
export const ProfileSchema = SchemaFactory.createForClass(Profile);
