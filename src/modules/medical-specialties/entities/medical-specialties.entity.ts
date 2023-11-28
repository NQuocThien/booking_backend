import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MedicalSpecialties {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  discription: string;
}
