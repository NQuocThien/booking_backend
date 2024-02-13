// import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Prop, Schema } from '@nestjs/mongoose';
@Schema()
export class LinkImage {
  @Prop()
  filename: string;

  @Prop()
  type: string;

  @Prop()
  url: string;
}
