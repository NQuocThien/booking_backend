import { ObjectType, Field, ID } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { Doctor } from 'src/modules/doctors/entities/docter.entity';
@ObjectType()
export class Degree {
  @Field((type) => ID)
  id: String;

  @Field()
  name: string;

  @Field()
  abbreviations: string;

  @Field(() => Doctor, { nullable: true })
  doctor: Doctor;
}
