import { ObjectType, Field, ID } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { MedicalSpecialties } from 'src/modules/medical-specialties/entities/medical-specialties.entity';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class Doctor {
  @Field(() => ID)
  id: String;

  @Field()
  name: String;

  @Field({ nullable: true })
  email: String;

  @Field({ nullable: true })
  numberPhone: String;

  @Field()
  userId: String;

  @Field(() => LinkImage, { nullable: true })
  avatar: LinkImage;

  @Field({ nullable: true })
  idSpecialist: string;

  @Field({ nullable: true })
  facilitiesId: string;

  @Field({ nullable: true })
  evaluate: number;

  @Field({ nullable: true })
  degree: string;

  @Field(() => MedicalSpecialties, { nullable: true })
  medicalSpecialties: MedicalSpecialties;
}
