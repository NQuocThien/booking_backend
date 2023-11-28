import { InputType, Field } from '@nestjs/graphql';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class CreateDoctorInput {
  @Field()
  name: String;

  @Field()
  idSpecialist: string;

  @Field()
  userId: string;

  @Field()
  avatar: LinkImageInput;

  @Field()
  evaluate: number;

  @Field()
  degree: string;
}
