import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CarePackage } from 'src/modules/care-package/entities/care-package.entity';
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

  @Field()
  numberPhone: string;

  @Field()
  email: string;

  @Field(() => [Doctor], { nullable: true })
  doctors: Doctor[];

  @Field(() => [CarePackage], { nullable: true })
  carePackage: CarePackage[];
}
