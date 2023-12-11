import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Doctor } from 'src/modules/doctors/entities/docter.entity';
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

  @Field({ nullable: true })
  lat: number;

  @Field({ nullable: true })
  lng: number;

  @Field({ nullable: true })
  numberPhone: string;

  @Field({ nullable: true })
  email: string;

  @Field(() => Doctor, { nullable: true })
  doctors: Doctor;
}
