import { ObjectType, Field } from '@nestjs/graphql';
import { SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class Customer {
  @Field({ nullable: true })
  fullname: string;
  @Field()
  userId: string;
}
export const CustomerSchema = new mongoose.Schema(Customer);
