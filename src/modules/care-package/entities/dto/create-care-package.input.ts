import { Field, InputType } from '@nestjs/graphql';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class createCarePackageInput {
  @Field()
  medicalFacilitiesId: string;

  @Field()
  typePackageId: string;

  @Field()
  name: string;

  @Field()
  discription: string;

  @Field()
  image: LinkImageInput;

  @Field()
  price: number;
}
