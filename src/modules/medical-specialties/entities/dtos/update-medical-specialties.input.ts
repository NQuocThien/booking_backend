import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class UpdateMedicalSpecialtyInput {
  @Field()
  id: string;

  @Field()
  medicalFactilityId: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  discription: string;
}
