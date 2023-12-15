import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Profile } from 'src/modules/profile/entity/profile.entity';
import { Register } from 'src/modules/register/entities/register.entity';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class CarePackage {
  @Field(() => ID)
  id: String;

  @Field()
  medicalFacilitiesId: string;

  @Field()
  typePackageId: string;

  @Field()
  name: string;

  @Field()
  discription: string;

  @Field()
  image: LinkImage;

  @Field()
  price: number;

  @Field(() => [Register], { nullable: true })
  register: Register[];
}
