import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegistrationCount {
  @Field()
  doctorCount: number;

  @Field()
  specialtyCount: number;

  @Field()
  packageCount: number;

  @Field()
  vaccineCount: number;
}
