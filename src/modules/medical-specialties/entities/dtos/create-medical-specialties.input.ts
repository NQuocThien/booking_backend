import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateMedicalSpecialtiesInput {
  @Field()
  name: String;

  @Field()
  discription: String;
}
