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

  @Field()
  userId: String;

  @Field(() => LinkImage)
  avatar: LinkImage;

  @Field()
  idSpecialist: string;

  @Field()
  facilitiesId: string;

  @Field()
  evaluate: number;

  @Field()
  degree: string;

  @Field(() => MedicalSpecialties, { nullable: true })
  medicalSpecialties: MedicalSpecialties;
}
