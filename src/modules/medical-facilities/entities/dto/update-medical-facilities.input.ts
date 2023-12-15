import { Field, InputType } from '@nestjs/graphql';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';

@InputType()
export class UpdateMedicalFacilitiesInput {
  @Field()
  id: string;

  @Field()
  companyName: string;

  @Field()
  userId: string;

  @Field()
  discription: string;

  @Field({ nullable: true })
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
