import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MedicalSpecialties {
  @Field(() => ID)
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
