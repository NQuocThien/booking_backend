import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class MedicalFacilities {
  @Field((type) => ID)
  id: String;

  @Field()
  companyName: string;

  @Field()
  discription: string;

  @Field(() => LinkImage)
  image: LinkImage;

  @Field()
  adress: string;
}
