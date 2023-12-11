import { Field, InputType } from '@nestjs/graphql';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';

@InputType()
export class CreateMedicalFacilitiesInput {
  @Field()
  companyName: string;

  @Field()
  userId: string;

  @Field()
  discription: string;

  @Field()
  image: LinkImageInput;

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
}
