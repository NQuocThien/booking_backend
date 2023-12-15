import { InputType, Field } from '@nestjs/graphql';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class CreateDoctorInput {
  @Field()
  name: String;

  @Field()
  email: String;

  @Field()
  numberPhone: String;

  @Field({ nullable: true })
  idSpecialist: string;

  @Field({ nullable: true })
  userId: string;

  @Field({ nullable: true })
  avatar: LinkImageInput;

  @Field({ nullable: true })
  degreeId: string;

  @Field({ nullable: true })
  facilitiesId: string;
}
