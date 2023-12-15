import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class UpdateMedicalSpecialtiesInput {
  @Field()
  id: String;

  @Field()
  name: String;

  @Field()
  discription: String;
}
