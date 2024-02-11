import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateMedicalSpecialtyInput {
  @Field()
  medicalFactilityId: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  discription: string;
}
